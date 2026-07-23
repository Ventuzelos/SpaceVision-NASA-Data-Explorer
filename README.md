# SpaceVision — NASA Data Explorer

<p align="center">
  <img
    src="./docs/preview-homepage.png"
    alt="Página inicial da aplicação SpaceVision"
    width="100%"
  >
</p>

<p align="center">
  Plataforma web para explorar dados oficiais da NASA através de uma experiência visual, intuitiva e interativa.
</p>

---

## Sobre o projeto

O **SpaceVision — NASA Data Explorer** é uma aplicação web que centraliza diferentes fontes de dados da NASA numa única plataforma.

A aplicação permite explorar imagens astronómicas, fotografias da Terra, eventos de meteorologia espacial, asteroides próximos do planeta e outros conteúdos relacionados com ciência e exploração espacial.

O projeto foi desenvolvido no âmbito do curso **Software Developer**, do **CESAE Digital**, integrando conhecimentos de:

- UX/UI Design;
- desenvolvimento Front-End;
- desenvolvimento Back-End;
- bases de dados;
- integração de APIs;
- autenticação e autorização;
- acessibilidade;
- testes;
- performance;
- controlo de versões.

A proposta do SpaceVision surgiu da necessidade de tornar os dados científicos mais acessíveis a utilizadores não especializados, apresentando a informação de forma organizada, visual e compreensível.

---

## Objetivos

O SpaceVision tem como principais objetivos:

- centralizar diferentes APIs oficiais da NASA;
- facilitar o acesso a conteúdos científicos;
- apresentar dados complexos de forma mais simples;
- incentivar a curiosidade e a aprendizagem;
- proporcionar uma experiência consistente em desktop, tablet e mobile;
- proteger a chave da API da NASA através de um back-end próprio;
- aplicar boas práticas de usabilidade, acessibilidade, segurança e organização de código.

---

## Funcionalidades principais

### Página inicial

A página inicial apresenta:

- secção principal de introdução;
- pesquisa global;
- imagem astronómica do dia;
- histórico das imagens dos dias anteriores;
- apresentação dos principais módulos da aplicação;
- chamadas para exploração de conteúdos;
- estados de carregamento e tratamento de erros.

### Astronomy Picture of the Day

Integração com a API **Astronomy Picture of the Day**, permitindo:

- consultar a imagem astronómica do dia;
- visualizar a explicação científica associada;
- consultar imagens por data;
- explorar imagens anteriores através de um carrossel;
- guardar conteúdos nos favoritos.

### DONKI

Integração com a API **Database of Notifications, Knowledge and Information**, dedicada a eventos de meteorologia espacial.

A aplicação suporta os seguintes tipos de eventos:

- Solar Flare — FLR;
- Coronal Mass Ejection — CME;
- Geomagnetic Storm — GST;
- Solar Energetic Particle — SEP;
- High Speed Stream — HSS;
- notificações da NASA.

Funcionalidades disponíveis:

- seleção do tipo de evento;
- filtragem por intervalo de datas;
- intervalos rápidos de 7, 30 e 90 dias;
- paginação;
- consulta detalhada dos eventos;
- estados de carregamento;
- tratamento de erros;
- sistema de favoritos.

### EPIC

Integração com a API **Earth Polychromatic Imaging Camera**, permitindo:

- visualizar imagens recentes da Terra;
- pesquisar imagens por data;
- navegar por uma linha temporal;
- abrir imagens em detalhe;
- consultar dados associados às fotografias;
- guardar imagens nos favoritos.

### NeoWatch

Módulo dedicado aos objetos próximos da Terra através da API **NeoWs**.

Inclui:

- pesquisa por intervalo de datas;
- listagem de asteroides próximos da Terra;
- indicação de objetos potencialmente perigosos;
- distância de aproximação;
- velocidade relativa;
- dimensões estimadas;
- ordenação de resultados;
- paginação;
- resumo estatístico dos resultados;
- visualização tridimensional do asteroide Bennu;
- sistema de favoritos.

### Discover

Área interativa dedicada à descoberta do espaço, com:

- galeria visual;
- exploração do Sistema Solar;
- linha temporal de acontecimentos espaciais;
- radar de asteroides;
- estado de missões;
- conteúdos educativos e informativos.

### Quiz espacial

Módulo educativo com:

- perguntas sobre astronomia e Sistema Solar;
- diferentes tipos de resposta;
- barra de progresso;
- feedback visual;
- cálculo da pontuação final;
- experiência animada e interativa.

### Pesquisa global

A pesquisa global permite encaminhar o utilizador para diferentes áreas da aplicação através de termos relacionados com:

- imagens astronómicas;
- meteorologia espacial;
- Terra;
- asteroides;
- Sistema Solar;
- missões;
- conteúdos educativos.

### Sistema de favoritos

Os utilizadores autenticados podem guardar conteúdos provenientes de:

- APOD;
- DONKI;
- EPIC;
- NeoWs.

A página de favoritos inclui:

- persistência dos dados na base de dados;
- filtragem por categoria;
- paginação;
- consulta detalhada;
- remoção de favoritos;
- sincronização entre diferentes componentes da aplicação.

### Autenticação

O sistema de autenticação inclui:

- registo;
- início de sessão;
- fim de sessão;
- proteção de rotas privadas;
- tokens de autenticação com Laravel Sanctum;
- validação de formulários;
- apresentação de mensagens de erro;
- possibilidade de mostrar ou ocultar a palavra-passe.

### Recuperação de palavra-passe

O utilizador pode:

- solicitar um link de recuperação;
- receber as instruções por email;
- definir uma nova palavra-passe;
- confirmar a nova palavra-passe;
- receber feedback sobre o resultado da operação.

### Perfil do utilizador

A área de perfil permite:

- consultar os dados da conta;
- alterar o nome;
- alterar o email;
- descarregar os dados pessoais;
- terminar a sessão;
- eliminar permanentemente a conta mediante confirmação da palavra-passe.

### Painel de administração

A área administrativa está protegida por autenticação e controlo de permissões.

O painel apresenta:

- número total de utilizadores;
- novos utilizadores no último mês;
- número total de favoritos;
- favoritos agrupados por categoria;
- conteúdos mais guardados;
- número total de mensagens de contacto;
- mensagens lidas e não lidas.

A gestão das mensagens permite:

- pesquisar mensagens;
- filtrar por estado;
- ordenar por data;
- marcar mensagens como lidas;
- eliminar mensagens.

### Formulário de contacto

A aplicação possui um formulário de contacto com:

- validação dos dados;
- armazenamento das mensagens na base de dados;
- limitação de pedidos;
- consulta através do painel administrativo.

### Páginas institucionais e legais

O projeto inclui:

- Sobre o projeto;
- Perguntas frequentes;
- Acessibilidade;
- Política de privacidade;
- Política de cookies;
- Termos e condições;
- página de acesso não autorizado;
- página de erro 404.

---

## Acessibilidade

A aplicação foi desenvolvida considerando boas práticas de acessibilidade, incluindo:

- utilização de HTML semântico;
- navegação por teclado;
- atributos ARIA;
- textos alternativos em imagens;
- estados de foco visíveis;
- mensagens de estado para tecnologias de apoio;
- contraste adequado;
- hierarquia de títulos;
- suporte para redução de movimento;
- página dedicada à declaração de acessibilidade.

O objetivo do projeto é aproximar-se das recomendações **WCAG 2.1, nível AA**.

---

## Responsividade

O SpaceVision adapta-se a diferentes dimensões de ecrã:

- dispositivos móveis;
- tablets;
- computadores portáteis;
- monitores de maiores dimensões.

A navegação, os cartões, os formulários, os modais e as visualizações foram desenvolvidos para manter consistência e legibilidade nos principais dispositivos.

---

## Performance e experiência de utilização

Foram aplicadas várias estratégias para melhorar o desempenho e a experiência do utilizador:

- carregamento diferido das páginas com `React.lazy`;
- divisão de código;
- componentes reutilizáveis;
- imagens otimizadas;
- estados skeleton;
- tratamento centralizado de erros;
- cache das respostas da NASA;
- limitação de pedidos;
- cancelamento lógico de respostas desatualizadas;
- animações controladas;
- carregamento otimizado das visualizações tridimensionais;
- construção de produção com Vite.

---

## SEO

O projeto inclui medidas básicas de otimização para motores de pesquisa:

- títulos e descrições específicos por página;
- componente reutilizável para metadados;
- ficheiro `robots.txt`;
- ficheiro `sitemap.xml`;
- estrutura semântica;
- textos alternativos;
- nomes de rotas compreensíveis;
- carregamento otimizado das páginas.

---

## Segurança

Entre as medidas implementadas encontram-se:

- chave da API da NASA armazenada exclusivamente no back-end;
- autenticação com Laravel Sanctum;
- proteção de rotas privadas;
- controlo de acesso administrativo;
- validação de dados no servidor;
- limitação de pedidos de autenticação e contacto;
- verificação de propriedade antes de eliminar favoritos;
- confirmação da palavra-passe antes de eliminar a conta;
- utilização de variáveis de ambiente;
- mensagens neutras na recuperação de palavra-passe;
- cache controlada das respostas externas.

---

## Tecnologias utilizadas

### Front-End

- React 19;
- Vite;
- React Router;
- JavaScript;
- CSS;
- Axios;
- Framer Motion;
- Lenis;
- Lucide React;
- Three.js;
- OGL.

### Back-End

- PHP;
- Laravel;
- Laravel Sanctum;
- Laravel HTTP Client;
- sistema de cache do Laravel.

### Base de dados

- MySQL.

### APIs externas

- NASA Astronomy Picture of the Day;
- NASA DONKI;
- NASA EPIC;
- NASA NeoWs.

### Testes

- Vitest;
- React Testing Library;
- jest-axe;
- PHPUnit.

### Ferramentas de desenvolvimento

- Git;
- GitHub;
- ESLint;
- Composer;
- npm.

---

## Arquitetura

O projeto está dividido em duas aplicações principais:

```text
SpaceVision-NASA-Data-Explorer
│
├── frontend
│   ├── public
│   └── src
│       ├── assets
│       ├── components
│       ├── constants
│       ├── context
│       ├── data
│       ├── hooks
│       ├── layouts
│       ├── pages
│       ├── services
│       ├── styles
│       └── utils
│
└── backend
    ├── app
    │   ├── Http
    │   │   ├── Controllers
    │   │   └── Middleware
    │   ├── Models
    │   └── Services
    ├── config
    ├── database
    │   ├── factories
    │   ├── migrations
    │   └── seeders
    ├── routes
    └── tests
```

### Fluxo da aplicação

```text
Interface React
      │
      ▼
Serviços do Front-End
      │
      ▼
API Laravel
      │
      ├── Autenticação
      ├── Favoritos
      ├── Perfil
      ├── Contactos
      ├── Administração
      └── Serviço NASA
              │
              ▼
         APIs da NASA
```

O Front-End não comunica diretamente com as APIs protegidas da NASA. Os pedidos são encaminhados para o Back-End Laravel, que adiciona a chave da API, valida os parâmetros, gere o cache e devolve os dados ao cliente.

---

## Principais componentes reutilizáveis

Entre os componentes partilhados encontram-se:

- `Button`;
- `Container`;
- `Section`;
- `Breadcrumb`;
- `SearchInput`;
- `Pagination`;
- `Carousel`;
- `FavoriteButton`;
- `ErrorState`;
- `Toast`;
- `Icon`;
- `PageMeta`;
- estados skeleton;
- modais de detalhe;
- componentes de proteção de rotas.

---

## Design system

### Tipografia

A interface utiliza a família tipográfica **Inter**.

### Cores principais

| Elemento | Valor |
|---|---:|
| Primary | `#4F46E5` |
| Secondary | `#7C3AED` |
| Accent | `#0EA5E9` |
| Success | `#10B981` |
| Warning | `#FACC15` |
| Error | `#FB7185` |
| Background | `#0B1020` |
| Surface | `#111827` |
| Text Primary | `#F9FAFC` |
| Text Secondary | `#CBD5E1` |
| Border | `#334155` |

### Princípios visuais

- interface escura;
- hierarquia visual clara;
- cartões reutilizáveis;
- conteúdo visual em destaque;
- consistência entre módulos;
- linguagem acessível;
- animações moderadas;
- componentes responsivos.

---

## Pré-requisitos

Antes de executar o projeto, é necessário instalar:

- Node.js;
- npm;
- PHP;
- Composer;
- MySQL;
- Git.

Também é necessária uma chave válida da API da NASA.

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/Ventuzelos/SpaceVision-NASA-Data-Explorer.git
```

```bash
cd SpaceVision-NASA-Data-Explorer
```

---

## Configuração do Back-End

### 2. Entrar na pasta do Back-End

```bash
cd backend
```

### 3. Instalar as dependências

```bash
composer install
```

### 4. Criar o ficheiro de ambiente

Em Windows:

```powershell
Copy-Item .env.example .env
```

Em Linux ou macOS:

```bash
cp .env.example .env
```

### 5. Gerar a chave da aplicação

```bash
php artisan key:generate
```

### 6. Configurar a base de dados

No ficheiro `.env`, atualizar os dados de ligação:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=spacevision_db
DB_USERNAME=root
DB_PASSWORD=
```

Criar previamente a base de dados `spacevision_db` no MySQL.

### 7. Configurar a API da NASA

Adicionar ao ficheiro `.env`:

```env
NASA_API_KEY=your_nasa_api_key
NASA_BASE_URL=https://api.nasa.gov
NASA_CACHE_TTL=3600
```

### 8. Executar as migrações

```bash
php artisan migrate
```

### 9. Criar um utilizador de desenvolvimento

No ficheiro `.env`, definir os dados do utilizador local:

```env
DEV_USER_NAME="Administrador"
DEV_USER_EMAIL=admin@spacevision.test
DEV_USER_PASSWORD=alterar_esta_password
DEV_USER_ROLE=admin
```

Depois executar:

```bash
php artisan db:seed
```

O seeder apenas pode ser executado em ambiente local.

O valor de `DEV_USER_ROLE` deve ser:

- `user`, para um utilizador comum;
- `admin`, para um administrador.

### 10. Iniciar o servidor Laravel

```bash
php artisan serve
```

O Back-End ficará disponível em:

```text
http://127.0.0.1:8000
```

---

## Configuração do Front-End

### 11. Entrar na pasta do Front-End

A partir da raiz do projeto:

```bash
cd frontend
```

### 12. Instalar as dependências

```bash
npm install
```

### 13. Criar o ficheiro de ambiente

Em Windows:

```powershell
Copy-Item .env.example .env
```

Em Linux ou macOS:

```bash
cp .env.example .env
```

O ficheiro deve conter:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### 14. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O Front-End ficará normalmente disponível em:

```text
http://localhost:5173
```

---

## Comandos disponíveis

### Front-End

Iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

Criar a versão de produção:

```bash
npm run build
```

Pré-visualizar a versão de produção:

```bash
npm run preview
```

Executar o ESLint:

```bash
npm run lint
```

Executar os testes:

```bash
npm run test
```

Executar os testes uma única vez:

```bash
npm run test:run
```

Executar os testes com cobertura:

```bash
npm run test:coverage
```

### Back-End

Iniciar o servidor:

```bash
php artisan serve
```

Executar os testes:

```bash
php artisan test
```

Limpar a cache da aplicação:

```bash
php artisan optimize:clear
```

Executar novamente as migrações:

```bash
php artisan migrate:fresh
```

---

## Testes implementados

### Front-End

Existem testes para:

- início de sessão;
- painel administrativo;
- pesquisa;
- paginação;
- botão de favoritos;
- seleção de eventos DONKI;
- filtros de datas DONKI;
- filtros de datas NeoWs;
- acessibilidade de componentes selecionados.

### Back-End

Existem testes para:

- autenticação;
- recuperação de palavra-passe;
- favoritos;
- mensagens de contacto;
- administração;
- controlador NASA;
- serviço de comunicação com a NASA.

---

## Rotas principais

### Aplicação

| Rota | Descrição |
|---|---|
| `/` | Página inicial e APOD |
| `/donki` | Meteorologia espacial |
| `/epic` | Imagens da Terra |
| `/neowatch` | Asteroides próximos da Terra |
| `/discover` | Área de descoberta interativa |
| `/quiz` | Quiz espacial |
| `/favorites` | Favoritos do utilizador |
| `/profile` | Perfil do utilizador |
| `/admin` | Painel administrativo |
| `/login` | Início de sessão |
| `/register` | Registo |
| `/forgot-password` | Recuperação de palavra-passe |
| `/reset-password` | Definição de nova palavra-passe |
| `/about` | Sobre o projeto |
| `/faq` | Perguntas frequentes |
| `/accessibility` | Acessibilidade |
| `/privacidade` | Política de privacidade |
| `/cookies` | Política de cookies |
| `/termos` | Termos e condições |

### API Laravel

A API disponibiliza endpoints para:

- autenticação;
- recuperação de palavra-passe;
- perfil;
- favoritos;
- mensagens de contacto;
- estatísticas administrativas;
- APOD;
- DONKI;
- EPIC;
- NeoWs.

---

## Estado atual do projeto

### Implementado

- estrutura React e Laravel;
- design system;
- navegação responsiva;
- integração APOD;
- integração DONKI;
- integração EPIC;
- integração NeoWs;
- área Discover;
- quiz espacial;
- autenticação;
- recuperação de palavra-passe;
- perfil de utilizador;
- sistema de favoritos;
- painel administrativo;
- formulário de contacto;
- páginas legais;
- página de acessibilidade;
- proteção de rotas;
- cache da API da NASA;
- tratamento de erros;
- estados de carregamento;
- testes Front-End e Back-End;
- metadados por página;
- `robots.txt`;
- `sitemap.xml`;
- build de produção.

### Em validação e melhoria

- auditoria final de performance;
- revisão completa de acessibilidade;
- aumento da cobertura de testes;
- otimização das visualizações tridimensionais;
- revisão final da documentação;
- testes em diferentes navegadores e dispositivos.

---

## Equipa

O projeto foi desenvolvido por:

- Ângela Pereira;
- Diana;
- Endyara;
- Isabel.

---

## Contexto académico

Projeto final desenvolvido no curso **Software Developer**, do **CESAE Digital**.

O trabalho combina competências de desenvolvimento Full-Stack, UX/UI Design, bases de dados, integração de APIs, segurança, testes e acessibilidade.

---

## Licença e utilização de conteúdos

Este projeto foi desenvolvido exclusivamente para fins académicos.

Os dados, imagens e restantes conteúdos científicos apresentados pertencem às respetivas entidades responsáveis e são disponibilizados através das APIs e recursos oficiais da NASA.

O SpaceVision não é um produto oficial da NASA e não representa nem possui afiliação institucional com a organização.

---

## Créditos

- NASA Open APIs;
- NASA Astronomy Picture of the Day;
- NASA DONKI;
- NASA EPIC;
- NASA NeoWs;
- CESAE Digital.

---

<p align="center">
  Desenvolvido com React, Laravel e dados oficiais da NASA.
</p>
