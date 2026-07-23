\# Checklist Final — SpaceVision



\## Git e repositório



\- \[x] A branch `main` está atualizada.

\- \[x] Não existem alterações locais por guardar.

\- \[x] Não existem conflitos de merge.

\- \[x] As branches concluídas foram integradas.

\- \[x] O `.gitignore` exclui ficheiros sensíveis e dependências.

\- \[x] Nenhum ficheiro `.env` foi enviado para o repositório.



\## Front-End



\- \[x] `npm ci` termina sem erros.

\- \[x] `npm run lint` termina sem erros.

\- \[x] `npm run test:run` aprova todos os testes.

\- \[x] `npm run build` termina com sucesso.

\- \[ ] As páginas principais carregam corretamente.

\- \[ ] Não existem erros na consola do navegador.

\- \[ ] A aplicação funciona em desktop, tablet e mobile.

\- \[ ] Não existe scroll horizontal indevido.



\## Back-End



\- \[x] `composer install` termina sem erros.

\- \[x] `php artisan optimize:clear` termina sem erros.

\- \[x] `php artisan test` aprova todos os testes.

\- \[x] `composer audit` não apresenta vulnerabilidades.

\- \[ ] As migrações executam corretamente.

\- \[x] O seeder local cria utilizadores comuns e administradores.

\- \[ ] Os endpoints protegidos exigem autenticação.

\- \[ ] Os endpoints administrativos bloqueiam utilizadores comuns.



\## Funcionalidades



\- \[ ] Registo funciona.

\- \[ ] Login funciona.

\- \[ ] Logout funciona.

\- \[ ] Recuperação de palavra-passe funciona.

\- \[ ] Atualização do perfil funciona.

\- \[ ] Eliminação da conta funciona.

\- \[ ] Favoritos podem ser adicionados e removidos.

\- \[ ] APOD carrega corretamente.

\- \[ ] DONKI carrega corretamente.

\- \[ ] EPIC carrega corretamente.

\- \[ ] NeoWS carrega corretamente.

\- \[ ] Discover funciona.

\- \[ ] Quiz funciona.

\- \[ ] Painel administrativo funciona.

\- \[ ] Mensagens de contacto podem ser consultadas, marcadas e eliminadas.



\## Segurança



\- \[x] A NASA API Key não aparece no Front-End.

\- \[x] A chave pessoal do utilizador não aparece nas respostas da API.

\- \[ ] Os tokens expiram corretamente.

\- \[x] As rotas administrativas estão protegidas.

\- \[x] Os formulários possuem validação.

\- \[ ] Os erros não apresentam stack traces ou dados sensíveis.

\- \[ ] O CORS permite apenas as origens necessárias.

\- \[x] Não existem vulnerabilidades conhecidas no npm ou Composer.



\## UX e acessibilidade



\- \[ ] A navegação pode ser utilizada por teclado.

\- \[ ] O foco é visível.

\- \[ ] Os modais fecham com Escape.

\- \[ ] Os campos têm labels.

\- \[ ] As imagens têm texto alternativo.

\- \[ ] O contraste é adequado.

\- \[ ] O zoom a 200% não impede a utilização.

\- \[ ] Os estados de carregamento, erro e ausência de resultados são claros.

\- \[ ] A linguagem é consistente em PT-PT.

\- \[ ] Os termos científicos mais técnicos possuem explicações simples.



\## Documentação e entrega



\- \[ ] O README corresponde à versão final do projeto.

\- \[ ] A instalação foi testada numa pasta limpa.

\- \[ ] As variáveis dos ficheiros `.env.example` estão documentadas.

\- \[x] A criação do administrador está documentada.

\- \[ ] As rotas principais estão documentadas.

\- \[ ] As funcionalidades removidas não aparecem como implementadas.

\- \[ ] Os autores e responsabilidades estão corretos.

\- \[ ] Existem dados preparados para a demonstração.

\- \[ ] Existe um plano de contingência caso a NASA esteja indisponível.

