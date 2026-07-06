# 🚀 SpaceVision – NASA Data Explorer

<p align="center">
  <img src="./docs/preview-homepage.png" alt="Preview do SpaceVision" width="100%">
</p>

<p align="center">

Uma aplicação web moderna para explorar as APIs públicas da NASA através de uma experiência intuitiva, educativa e interativa.

</p>

---

# 📖 Sobre o Projeto

O **SpaceVision** é uma aplicação web desenvolvida para permitir aos utilizadores explorar dados reais disponibilizados pela NASA através das suas APIs oficiais.

A aplicação reúne diferentes serviços da NASA numa única plataforma, permitindo visualizar imagens astronómicas, fotografias captadas pelos rovers em Marte, imagens da Terra e outros conteúdos relacionados com o espaço.

Este projeto está a ser desenvolvido como **Projeto Final** do curso **Software Developer** do **CESAE Digital**, combinando conhecimentos de UX/UI Design, Front-End, Back-End e integração de APIs.

---

# ✨ Funcionalidades

## Homepage

- Hero Section
- Pesquisa rápida
- Exploração das APIs disponíveis
- Conteúdo em destaque
- Call To Action
- Layout responsivo

## APIs da NASA

- Astronomy Picture of the Day (APOD)
- Mars Rover Photos
- EPIC (Earth Polychromatic Imaging Camera)
- Near Earth Objects *(Em desenvolvimento)*

## Funcionalidades

- Pesquisa
- Favoritos
- Interface responsiva
- Tema escuro

---

# 🛠 Tecnologias Utilizadas

## Front-End

- React
- Vite
- React Router
- CSS3
- JavaScript ES6+

## Back-End

- Laravel
- PHP

## Base de Dados

- MySQL

## APIs

- NASA Open APIs

## Controlo de Versões

- Git
- GitHub

---

# 📂 Estrutura do Projeto

```text
src
│
├── assets
│
├── components
│   ├── common
│   ├── home
│   └── layout
│
├── constants
├── context
├── data
├── hooks
├── layouts
├── pages
├── services
├── styles
└── utils
```

---

# 🎨 Design System

## Tipografia

- Inter

## Paleta de Cores

| Cor | Hex |
|------|------|
| Primary | #4F46E5 |
| Secondary | #7C3AED |
| Accent | #0EA5E9 |
| Success | #10B981 |
| Warning | #FACC15 |
| Error | #FB7185 |
| Background | #0B1020 |
| Surface | #111827 |

---

# 🧩 Componentes

## Componentes Reutilizáveis

- Button
- SearchInput
- Loader
- SectionTitle
- Card
- Container

## Componentes de Layout

- Navbar
- Logo
- Footer
- UserMenu
- NavLinks

## Componentes da Homepage

- Hero
- ApiSection
- FeaturedSection
- CTASection

---

# 📱 Responsividade

A aplicação foi desenvolvida para funcionar corretamente em diferentes dispositivos.

- 📱 Mobile
- 💻 Tablet
- 🖥 Desktop

---

# 🚀 Como Executar o Projeto

## Clonar o repositório

```bash
git clone https://github.com/Ventuzelos/SpaceVision-NASA-Data-Explorer.git
```

## Entrar na pasta do Front-End

```bash
cd SpaceVision-NASA-Data-Explorer/frontend
```

## Instalar dependências

```bash
npm install
```

## Iniciar o servidor

```bash
npm run dev
```

A aplicação ficará disponível em:

```
http://localhost:5173
```

---

# 📅 Roadmap

## Sprint 1

- [x] Estrutura inicial do projeto
- [x] Configuração do React + Vite
- [x] Routing
- [x] Layout
- [x] Homepage
- [x] Design System

## Sprint 2

- [ ] Integração da API APOD
- [ ] Integração da API Mars Rover
- [ ] Integração da API EPIC
- [ ] Galeria de Imagens

## Sprint 3

- [ ] Sistema de Favoritos
- [ ] Pesquisa
- [ ] Filtros

## Sprint 4

- [ ] Melhorias de Performance
- [ ] Melhorias de Acessibilidade
- [ ] Testes finais

---

# 🏗 Arquitetura

O projeto segue uma arquitetura baseada em componentes reutilizáveis.

```text
Pages
    │
    ▼
Layouts
    │
    ▼
Sections
    │
    ▼
Components
    │
    ▼
Common Components
```

Toda a lógica relacionada com consumo de APIs encontra-se isolada na pasta **services**, permitindo uma melhor organização e escalabilidade do projeto.

---

# 📸 Capturas de Ecrã

## Homepage

*Em desenvolvimento*

## APOD

*Em desenvolvimento*

## Mars Rover

*Em desenvolvimento*

---

# 🌍 APIs Utilizadas

Este projeto utiliza as APIs públicas disponibilizadas pela NASA.

- Astronomy Picture of the Day
- Mars Rover Photos
- EPIC
- NASA Image Library

Documentação oficial:

https://api.nasa.gov/

---

# 👥 Equipa

- Ângela
- Diana
- Endyara
- Isabel

---

# 🎓 Projeto Académico

Projeto desenvolvido no âmbito do curso **Software Developer** do **CESAE Digital**.

---

# 📄 Licença

Este projeto tem fins exclusivamente académicos.

Os dados e imagens utilizados pertencem à NASA e são disponibilizados através das suas APIs públicas.

---

# 🚀 Melhorias Futuras

- Sistema de autenticação
- Perfis de utilizador
- Download de imagens
- Filtros avançados
- Pesquisa inteligente
- Infinite Scroll
- Tema Claro / Escuro
- Progressive Web App (PWA)
- Testes Unitários
- Docker

---

<p align="center">

Desenvolvido com ❤️ utilizando React + Laravel

</p>
