# Quiz com Perguntas Geradas por IA

## Objetivo

O Quiz Espacial (`/Quiz`) tinha 8 perguntas fixas, escritas à mão em [quizQuestions.js](../frontend/src/data/quizQuestions.js). Este documento explica, passo a passo, como foi acrescentada uma segunda fonte de perguntas — geradas por IA (Google Gemini), guardadas numa pool na base de dados e renovadas automaticamente todas as semanas — sem partir o comportamento existente.

---

## Decisão de arquitetura

**Pool pré-gerada, não geração ao vivo.** As perguntas são geradas em lote por um comando agendado (uma vez por semana) e guardadas na base de dados. Quando um utilizador abre o Quiz, o frontend pede 8 perguntas aleatórias já prontas — zero latência extra, custo prevísivel, e o fluxo do Quiz (transições instantâneas entre perguntas) não precisa de ser redesenhado.

Se a chamada à API falhar ou a pool estiver vazia, o Quiz usa sempre o array estático original como *fallback* — nunca fica partido por causa da IA.

**Fornecedor:** Google Gemini API (`gemini-3.6-flash`), por ter um tier gratuito suficiente para este volume (~15-20 perguntas/semana) e suportar saída JSON estruturada (`responseSchema`).

O modelo está **fixo numa versão concreta, não no alias `gemini-flash-latest`**. O alias aponta para um modelo *thinking* que chegou a demorar 73s a responder "ola" e devolveu 503 (`high demand`) em três tentativas seguidas — um lote semanal falhava sem razão aparente. `gemini-3.6-flash` responde em ~4s e gera as 15 perguntas em ~33s.

---

## Passo 1 — Configuração

Chave da API e modelo em `backend/.env` (nunca commitado — está no `.gitignore`):

```env
GEMINI_API_KEY=...
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
GEMINI_MODEL=gemini-3.6-flash
```

A chave é enviada no header `x-goog-api-key`, **nunca em `?key=` na URL**: o Guzzle inclui a URL completa nas mensagens de exceção, e essas mensagens vão parar ao `laravel.log` — bastava uma falha da Gemini para a chave ficar escrita em claro nos logs.

Bloco correspondente em [config/services.php](../backend/config/services.php), seguindo o mesmo padrão já usado para `nasa` e `libretranslate`:

```php
'gemini' => [
    'api_key' => env('GEMINI_API_KEY'),
    'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
    'model' => env('GEMINI_MODEL', 'gemini-3.6-flash'),
],
```

`.env.example` tem as mesmas chaves vazias, para qualquer pessoa que clone o projeto saber o que configurar.

---

## Passo 2 — Base de dados

Migration `create_quiz_questions_table` ([backend/database/migrations](../backend/database/migrations)):

| Coluna | Tipo | Nota |
|---|---|---|
| `type` | string | `"Escolha múltipla"` ou `"Verdadeiro ou Falso"` |
| `text_pt` / `text_en` | text | Pergunta nos dois idiomas |
| `options_pt` / `options_en` | json | Arrays paralelos (mesma ordem, mesmo tamanho) |
| `correct_index` | tinyint | Índice da opção certa, válido para as duas línguas |
| `fact_pt` / `fact_en` | text | Curiosidade mostrada depois de responder |
| `source` | string | `"ai"` por omissão — permite distinguir de futuras perguntas manuais |

Texto e opções guardam-se **em PT e EN em colunas separadas** (em vez de escolher o idioma no momento da geração), pelo mesmo motivo por que o `APODCard` guarda `original_title`/`translated_title`: a tradução tem de estar disponível para os dois idiomas ao mesmo tempo, porque o utilizador pode trocar de idioma a meio da sessão.

Model: [`App\Models\QuizQuestion`](../backend/app/Models/QuizQuestion.php) — `casts` para `array` nos campos JSON, `HasFactory` para os testes.

---

## Passo 3 — Serviço de geração

[`App\Services\QuizQuestionGeneratorService`](../backend/app/Services/QuizQuestionGeneratorService.php) faz três coisas:

1. **Chama a Gemini** com um prompt que pede N perguntas em JSON, usando `generationConfig.responseSchema` para forçar a forma da resposta (tipo, textos PT/EN, opções PT/EN, índice correto, factos PT/EN).
2. **Valida cada pergunta antes de gravar** — mesmo com `responseSchema`, o schema não consegue expressar tudo (ex.: `correct_index` tem de estar dentro dos limites de `options`). Perguntas malformadas são descartadas e registadas em log, nunca chegam à base de dados.
3. **Grava só as válidas** via `QuizQuestion::create()`.

Isto é uma fronteira de confiança: conteúdo gerado por IA nunca é assumido como correto só porque "pedimos em JSON" — é sempre validado antes de ser servido a um utilizador.

---

## Passo 4 — Comando agendado

[`App\Console\Commands\GenerateQuizQuestions`](../backend/app/Console/Commands/GenerateQuizQuestions.php):

```bash
php artisan quiz:generate-questions --count=15 --prune=100
```

- Gera `--count` perguntas novas via o serviço acima.
- Remove as mais antigas se a pool ultrapassar `--prune` perguntas (evita crescimento sem limite).

Agendado semanalmente em [`routes/console.php`](../backend/routes/console.php):

```php
Schedule::command('quiz:generate-questions')
    ->weekly()
    ->sundays()
    ->at('03:00');
```

*(Precisa do cron do Laravel a correr no servidor — `* * * * * php artisan schedule:run` — para o agendamento disparar sozinho em produção.)*

---

## Passo 5 — Endpoint

[`App\Http\Controllers\Api\QuizController::index()`](../backend/app/Http/Controllers/Api/QuizController.php) devolve 8 perguntas aleatórias:

```php
QuizQuestion::query()->inRandomOrder()->limit(8)->get([...]);
```

Rota pública (sem autenticação, o Quiz não exige login) em [`routes/api.php`](../backend/routes/api.php):

```php
Route::prefix('quiz')
    ->middleware('throttle:30,1')
    ->group(fn () => Route::get('/questions', [QuizController::class, 'index']));
```

---

## Passo 6 — Frontend

**[`services/quizService.js`](../frontend/src/services/quizService.js)** — chama o endpoint e devolve os dados em bruto, com PT e EN lado a lado (não escolhe o idioma aqui — ver Passo 7 sobre porquê).

**[`pages/Quiz/Quiz.jsx`](../frontend/src/pages/Quiz/Quiz.jsx)**:

1. Estado `questions` inicializado com o array estático (fallback instantâneo, sem loading spinner).
2. Um `useEffect` no arranque tenta buscar perguntas de IA; se a fase ainda for `"idle"` (o utilizador não começou a jogar) e vierem perguntas válidas, substitui o estado.
3. Um `phaseRef` impede a substituição depois de o jogo já ter começado — evita que as perguntas mudem debaixo do utilizador a meio de uma partida.

### Correção de um bug de tradução

Primeira versão do `quizService.js` escolhia o idioma (PT/EN) **no momento do fetch**, guardando um texto único no estado. Isto partia a troca de idioma: se o utilizador mudasse de português para inglês depois de as perguntas terem carregado, o texto ficava preso na língua antiga — o `useEffect` só corre uma vez, não reage a mudanças de idioma.

Correção: o serviço passa a devolver os dois idiomas em campos separados (`text_pt`/`text_en`, etc.), e o `Quiz.jsx` escolhe o campo certo **em cada render**, a partir de `i18n.resolvedLanguage` — o mesmo padrão que o `APODCard` já usa para `original_title`/`translated_title`. Assim, trocar de idioma a meio da sessão atualiza o texto imediatamente, sem precisar de um novo pedido à API.

---

## Passo 7 — Testes

**Backend** ([`tests/Feature`](../backend/tests/Feature)):
- `QuizQuestionGeneratorServiceTest` — com `Http::fake()`: perguntas válidas são gravadas, perguntas malformadas são descartadas, falta de chave/JSON inválido lança exceção.
- `QuizControllerTest` — o endpoint devolve no máximo 8 perguntas, e menos se a pool for pequena.

**Frontend**: a suite Vitest existente (47 testes) continua a passar sem alterações — o Quiz não tinha testes próprios antes desta feature.

---

## Comandos úteis

```bash
# Gerar perguntas manualmente (sem esperar pelo agendamento semanal)
php artisan quiz:generate-questions --count=15

# Ver quantas perguntas existem na pool
php artisan tinker --execute="echo App\Models\QuizQuestion::count();"

# Correr só os testes do quiz
php artisan test --filter=Quiz
```

---

## Ficheiros criados/alterados

| Ficheiro | O quê |
|---|---|
| `backend/.env`, `.env.example` | Chave e config da Gemini |
| `backend/config/services.php` | Bloco `gemini` |
| `backend/database/migrations/..._create_quiz_questions_table.php` | Tabela nova |
| `backend/database/factories/QuizQuestionFactory.php` | Factory para testes |
| `backend/app/Models/QuizQuestion.php` | Model novo |
| `backend/app/Services/QuizQuestionGeneratorService.php` | Geração + validação |
| `backend/app/Console/Commands/GenerateQuizQuestions.php` | Comando artisan |
| `backend/routes/console.php` | Agendamento semanal |
| `backend/app/Http/Controllers/Api/QuizController.php` | Endpoint |
| `backend/routes/api.php` | Rota `/quiz/questions` |
| `backend/tests/Feature/QuizQuestionGeneratorServiceTest.php` | Testes do serviço |
| `backend/tests/Feature/QuizControllerTest.php` | Testes do endpoint |
| `frontend/src/services/quizService.js` | Cliente do endpoint |
| `frontend/src/pages/Quiz/Quiz.jsx` | Integração + fallback + fix de idioma |
