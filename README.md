# Sistema de Moeda Estudantil

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O <strong>Sistema de Moeda Estudantil</strong> é uma aplicação web desenvolvida para estimular o reconhecimento do mérito estudantil por meio de uma moeda virtual. A moeda pode ser distribuída por professores aos seus alunos e trocada por produtos e descontos em empresas parceiras.
      </div>
      <br>
      <div align="justify">
        O objetivo principal é digitalizar e simplificar o processo de reconhecimento acadêmico, permitindo que alunos, professores e empresas parceiras interajam em um sistema centralizado, seguro e rastreável.
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

![Versão](https://img.shields.io/badge/Versão-Release%201-blue?style=for-the-badge)
![Sprint](https://img.shields.io/badge/Sprint%20Atual-Lab03S02-6d28d9?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20Prisma-339933?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-61DAFB?style=for-the-badge)
![DB](https://img.shields.io/badge/Banco-PostgreSQL%2016-4169E1?style=for-the-badge)
![License](https://img.shields.io/badge/Licença-MIT-007ec6?style=for-the-badge)

---

## 📚 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Modelo de Dados](#-modelo-de-dados)
- [Incrementos de Desenvolvimento](#-incrementos-de-desenvolvimento)
- [Instalação e Execução](#-instalação-e-execução)
- [Rotas da API](#-rotas-da-api)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [User Stories](#-user-stories)
- [Diagramas](#-diagramas)
- [Documentações Utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 📝 Sobre o Projeto

O **Sistema de Moeda Estudantil** é uma aplicação web Full-Stack projetada para fomentar o mérito acadêmico por meio de uma moeda virtual gerenciada dentro do ambiente institucional.

- **Por que ele existe:** Surgiu da necessidade de criar um canal formal e rastreável para que professores reconheçam bons comportamentos e desempenhos de alunos, substituindo elogios informais por um sistema de recompensas concreto e mensurável.
- **Qual problema ele resolve:** Centraliza a distribuição e o resgate de moedas estudantis, garantindo reconhecimento de mérito, transparência financeira e um ecossistema de vantagens para alunos.
- **Contexto:** Desenvolvido na disciplina de Laboratório de Desenvolvimento de Software da PUC Minas, aplicando boas práticas de Engenharia de Software com arquitetura **MVC**, desenvolvimento **Full-Stack** e modelagem **UML** completa.

---

## ✨ Funcionalidades Principais

- 👤 **Gestão de Alunos (CRUD):** Cadastro com nome, e-mail, CPF, RG, endereço, instituição e curso.
- 🏢 **Gestão de Empresas Parceiras (CRUD):** Empresas se cadastram e oferecem vantagens com descrição, foto e custo em moedas.
- 🏫 **Gestão de Instituições:** Instituições pré-cadastradas para vinculação de alunos e professores.
- 💰 **Distribuição de Moedas:** Professor envia moedas a um aluno com motivo obrigatório *(Sprint 03)*.
- 🎁 **Resgate de Vantagens:** Aluno seleciona uma vantagem, tem o saldo descontado e recebe cupom *(Sprint 03)*.
- 📋 **Extrato de Conta:** Alunos e professores consultam histórico completo de transações *(Sprint 03)*.
- 📧 **Notificações por E-mail:** Envio automático ao receber moedas e ao resgatar vantagens *(Sprint 03)*.
- 🔒 **Autenticação JWT:** Login seguro para alunos, professores e empresas *(Sprint 03)*.

---

## 🛠 Tecnologias Utilizadas

A stack foi escolhida com foco em TypeScript unificado em toda a aplicação e alinhamento com a arquitetura **MVC** exigida pelo laboratório.

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Runtime back-end** | [Node.js 20](https://nodejs.org/) | Runtime leve, não-blocante, amplamente adotado |
| **Framework back-end** | [Express](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/) | MVC minimalista; TypeScript unificado com o front |
| **ORM / Persistência** | [Prisma 5](https://www.prisma.io/) | Schema tipado, migrations automáticas, excelente DX |
| **Banco de Dados** | [PostgreSQL 16](https://www.postgresql.org/) | Banco relacional robusto para transações de moedas |
| **Validação** | [Zod](https://zod.dev/) | Schemas compartilháveis entre back-end e front-end |
| **Front-end** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/) | SPA moderna, tipagem estática, build rápido |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/) | Utilitário CSS — alta produtividade sem CSS manual |
| **Componentes UI** | Componentes customizados com Tailwind | Button, Input, Modal, Badge, Select, Spinner... |
| **Formulários** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Formulários performáticos com validação integrada |
| **HTTP client** | [Axios](https://axios-http.com/) | Interceptors e tratamento de erros centralizado |
| **Roteamento** | [React Router v6](https://reactrouter.com/) | SPA com navegação sem reload |
| **Ícones** | [Lucide React](https://lucide.dev/) | SVG tree-shakeable e moderno |
| **Autenticação** | JWT *(Sprint 03)* | Autenticação stateless para API REST |
| **E-mail** | Nodemailer *(Sprint 03)* | Notificações e cupons |
| **Containerização** | [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) | PostgreSQL local sem instalação manual |
| **Controle de Versão** | [Git](https://git-scm.com/) + [GitHub](https://github.com/) | Versionamento e colaboração |

---

## 🏗 Arquitetura

```
Frontend (React + Vite  →  :5173)
    └── Axios  →  /api/*  (proxy Vite)
         └── Backend (Express  →  :3333)
              └── Controller → Service → Repository → Prisma → PostgreSQL (:5432)
```

### Camadas do back-end

| Camada | Responsabilidade |
|---|---|
| **Controller** | Recebe a requisição HTTP, chama o service, retorna a resposta |
| **Service** | Aplica regras de negócio (unicidade, existência de FK, validações) |
| **Repository** | Acessa o banco via Prisma, sem lógica de negócio |
| **Prisma Client** | ORM — mapeia entidades TypeScript ↔ SQL, gera migrations |

---

## 🗄 Modelo de Dados

### Entidades implementadas — Sprint Lab03S02

```
Instituicao     → id, nome, createdAt, updatedAt
Aluno           → id, nome, email, cpf, rg, endereco, curso, saldoMoedas(=0), instituicaoId, usuarioId?
EmpresaParceira → id, nome, email, cnpj, endereco, telefone?, status(ATIVA|INATIVA), usuarioId?
```

### Entidades no schema — implementação Sprint Lab03S03

```
Usuario        → id, nome, email, senhaHash, tipo(ALUNO|PROFESSOR|EMPRESA|ADMIN)
Professor      → id, nome, cpf, departamento, saldoMoedas(=1000), instituicaoId, usuarioId?
Vantagem       → id, titulo, descricao, fotoUrl?, custoMoedas, empresaParceiraId
TransacaoMoeda → id, tipo(ENVIO|RECEBIMENTO|RESGATE), valor, motivo, alunoId, professorId?, vantagemId?
Resgate        → id, codigoCupom(único), status(PENDENTE|UTILIZADO), alunoId, vantagemId
```

### Relacionamentos

```
Instituicao      ──<  Aluno
Instituicao      ──<  Professor
Usuario          ──── Aluno           (1:1)
Usuario          ──── Professor       (1:1)
Usuario          ──── EmpresaParceira (1:1)
EmpresaParceira  ──<  Vantagem
Aluno            ──<  TransacaoMoeda
Professor        ──<  TransacaoMoeda
Vantagem         ──<  TransacaoMoeda
Aluno            ──<  Resgate
Vantagem         ──<  Resgate
```

---

## 📈 Incrementos de Desenvolvimento

Cada incremento representa uma entrega funcional ou artefato de projeto vinculado a uma sprint, seguindo as entregas definidas no roteiro do laboratório.

| # | Incremento | Sprint | Status |
|:-:|---|:---:|:---:|
| 1 | Diagrama de Casos de Uso | Sprint 01 | ✅ Concluído |
| 2 | Histórias do Usuário (HU01–HU18) | Sprint 01 | ✅ Concluído |
| 3 | Diagrama de Classes | Sprint 01 | ✅ Concluído |
| 4 | Diagrama de Componentes | Sprint 01 | 🔄 Em andamento |
| 5 | Modelo ER — `prisma/schema.prisma` | Sprint 02 | ✅ Concluído |
| 6 | Configuração do banco de dados (PostgreSQL + Docker) | Sprint 02 | ✅ Concluído |
| 7 | Camada de persistência com Prisma ORM (schema + migrations) | Sprint 02 | ✅ Concluído |
| 8 | CRUD de Aluno — back-end (API REST) | Sprint 02 | ✅ Concluído |
| 9 | CRUD de Empresa Parceira — back-end (API REST) | Sprint 02 | ✅ Concluído |
| 10 | CRUD de Aluno — front-end (React + integração com API) | Sprint 02 | ✅ Concluído |
| 11 | CRUD de Empresa Parceira — front-end (React + integração com API) | Sprint 02 | ✅ Concluído |
| 12 | CRUD de Instituição (back-end + front-end) + Dashboard | Sprint 02 | ✅ Concluído |
| 13 | Autenticação e autorização (Spring Security + JWT) | Sprint 03 | ⏳ Pendente |
| 14 | Módulo de Professor: distribuição de moedas com validação de saldo | Sprint 03 | ⏳ Pendente |
| 15 | Módulo de Aluno: resgate de vantagens + geração de cupom com código único | Sprint 03 | ⏳ Pendente |
| 16 | Notificações por e-mail (recebimento de moedas e resgate de vantagem) | Sprint 03 | ⏳ Pendente |
| 17 | Extrato de conta (professores e alunos) | Sprint 03 | ⏳ Pendente |
| 18 | Diagrama de Arquitetura + slides para apresentação final | Sprint 03 | ⏳ Pendente |

> **Legenda:** ✅ Concluído &nbsp;|&nbsp; 🔄 Em andamento &nbsp;|&nbsp; ⏳ Pendente

---

## 🔧 Instalação e Execução

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/) e npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/SistemaMoedaEstudantil.git
cd SistemaMoedaEstudantil
```

### 2. Configure o banco de dados (Docker)

```bash
docker-compose up -d
```

Sobe um container PostgreSQL 16 na porta `5432` com:

| Variável | Valor |
|---|---|
| Usuário | `postgres` |
| Senha | `postgres` |
| Banco | `moeda_estudantil` |

### 3. Configure e inicie o back-end

```bash
cd backend
npm install
copy .env.example .env    # Windows
# cp .env.example .env    # Linux / macOS
npx prisma migrate deploy  # aplica todas as migrations
npx prisma db seed         # cria as 5 instituições iniciais
npm run dev
```

O back-end estará em: **http://localhost:3333**

### 4. Inicie o front-end

```bash
cd ../frontend
npm install
npm run dev
```

O front-end estará em: **http://localhost:5173**

### 5. Acesse o sistema

Abra **[http://localhost:5173](http://localhost:5173)** e entre com qualquer e-mail e senha.

> ⚠️ A autenticação real (JWT) será implementada na Sprint Lab03S03. Qualquer combinação de e-mail/senha válida concede acesso.

---

## 🔌 Rotas da API

Base URL: `http://localhost:3333/api`

### Health Check

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se a API está respondendo |

### Alunos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/alunos` | Lista todos (suporta `?search=`) |
| `GET` | `/alunos/:id` | Busca por ID |
| `POST` | `/alunos` | Cria novo aluno |
| `PUT` | `/alunos/:id` | Atualiza aluno |
| `DELETE` | `/alunos/:id` | Remove aluno |

### Empresas Parceiras

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/empresas-parceiras` | Lista todas (suporta `?search=`) |
| `GET` | `/empresas-parceiras/:id` | Busca por ID |
| `POST` | `/empresas-parceiras` | Cria nova empresa |
| `PUT` | `/empresas-parceiras/:id` | Atualiza empresa |
| `DELETE` | `/empresas-parceiras/:id` | Remove empresa |

### Instituições

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/instituicoes` | Lista todas (suporta `?search=`) |
| `GET` | `/instituicoes/:id` | Busca por ID |
| `POST` | `/instituicoes` | Cria nova instituição |
| `PUT` | `/instituicoes/:id` | Atualiza instituição |
| `DELETE` | `/instituicoes/:id` | Remove instituição |

### Dashboard

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/dashboard` | Totais + últimos 5 alunos e 5 empresas |

---

## 📂 Estrutura de Pastas

```
SistemaMoedaEstudantil/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           ← Modelo de dados completo (8 entidades)
│   │   ├── seed.ts                 ← Dados iniciais (5 instituições)
│   │   └── migrations/             ← Histórico de migrations
│   ├── src/
│   │   ├── controllers/            ← Camada MVC — recebem requisições HTTP
│   │   ├── services/               ← Regras de negócio e validações
│   │   ├── repositories/           ← Acesso ao banco via Prisma
│   │   ├── routes/                 ← Definição das rotas Express
│   │   ├── validators/             ← Schemas Zod de validação
│   │   ├── middlewares/            ← AppError + errorHandler global
│   │   ├── lib/
│   │   │   └── prisma.ts           ← Singleton do PrismaClient
│   │   └── server.ts               ← Entry point da aplicação
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             ← Layout, Sidebar, Header
│   │   │   └── ui/                 ← Button, Input, Modal, Badge, Select...
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── alunos/             ← AlunosList + AlunoForm
│   │   │   ├── empresas/           ← EmpresasList + EmpresaForm
│   │   │   └── instituicoes/       ← InstituicoesList
│   │   ├── services/               ← Chamadas HTTP via Axios
│   │   ├── types/index.ts          ← Tipagens TypeScript
│   │   ├── App.tsx                 ← Rotas React Router
│   │   └── main.tsx
│   ├── tailwind.config.ts
│   ├── vite.config.ts              ← Proxy /api → :3333
│   └── package.json
│
├── docs/
│   └── diagramas/
│       ├── casos-de-uso/           ← Diagrama UC (JPEG)
│       ├── diagrama-de-classes/    ← Diagrama de Classes (JPEG)
│       ├── componentes/            ← Diagrama de Componentes (.drawio)
│       ├── modelo-er/              ← Modelo ER (Sprint 02 — schema.prisma)
│       └── arquitetura/            ← Diagrama de Arquitetura (Sprint 03)
├── docker-compose.yml              ← PostgreSQL 16 local
├── .env.example                    ← Template de variáveis de ambiente
├── .gitignore
└── README.md
```

---

## 👥 User Stories

### Aluno

| ID | História do Usuário | Critérios de Aceitação | Status |
|---|---|---|:---:|
| HU01 | Como aluno, quero me cadastrar no sistema para participar do programa de moeda estudantil. | Informar nome, e-mail, CPF, RG, endereço, instituição e curso. | ✅ Sprint 02 |
| HU02 | Como aluno, quero fazer login para acessar minhas funcionalidades com segurança. | O sistema deve validar e-mail e senha antes de liberar acesso. | 🔄 Sprint 03 |
| HU03 | Como aluno, quero consultar meu saldo para saber quantas moedas possuo. | O sistema deve exibir o saldo atualizado. | ⏳ Sprint 03 |
| HU04 | Como aluno, quero consultar meu extrato para acompanhar moedas recebidas e vantagens resgatadas. | O extrato deve listar data, tipo da transação, valor e descrição. | ⏳ Sprint 03 |
| HU05 | Como aluno, quero visualizar vantagens disponíveis para escolher onde gastar minhas moedas. | O sistema deve listar vantagens com descrição, foto, empresa e custo em moedas. | ⏳ Sprint 03 |
| HU06 | Como aluno, quero resgatar uma vantagem para trocar minhas moedas por benefícios. | O sistema deve validar saldo, descontar moedas e gerar um código de cupom. | ⏳ Sprint 03 |
| HU07 | Como aluno, quero receber um e-mail com o cupom para apresentar na troca presencial. | O e-mail deve conter o código gerado pelo sistema e dados da vantagem. | ⏳ Sprint 03 |

### Professor

| ID | História do Usuário | Critérios de Aceitação | Status |
|---|---|---|:---:|
| HU08 | Como professor, quero fazer login para acessar minha conta no sistema. | O sistema deve autenticar professor pré-cadastrado. | 🔄 Sprint 03 |
| HU09 | Como professor, quero receber 1.000 moedas por semestre para distribuir aos alunos. | O saldo semestral deve ser acumulado ao saldo existente. | ⏳ Sprint 03 |
| HU10 | Como professor, quero enviar moedas a um aluno para reconhecer seu mérito. | Deve selecionar aluno, informar quantidade e motivo obrigatório. | ⏳ Sprint 03 |
| HU11 | Como professor, quero que o sistema valide meu saldo antes do envio. | A transação só deve ocorrer se houver saldo suficiente. | ⏳ Sprint 03 |
| HU12 | Como professor, quero consultar meu extrato para ver as moedas que distribuí. | O extrato deve mostrar envios realizados, alunos, valores, datas e motivos. | ⏳ Sprint 03 |

### Empresa Parceira

| ID | História do Usuário | Critérios de Aceitação | Status |
|---|---|---|:---:|
| HU13 | Como empresa parceira, quero me cadastrar no sistema para oferecer vantagens aos alunos. | Deve informar dados da empresa, login e senha. | ✅ Sprint 02 |
| HU14 | Como empresa parceira, quero cadastrar vantagens para que alunos possam resgatá-las. | Deve informar título, descrição, foto e custo em moedas. | ⏳ Sprint 03 |
| HU15 | Como empresa parceira, quero receber um e-mail quando uma vantagem for resgatada. | O e-mail deve conter código de validação, aluno e vantagem resgatada. | ⏳ Sprint 03 |

### Administrador / Sistema

| ID | História do Usuário | Critérios de Aceitação | Status |
|---|---|---|:---:|
| HU16 | Como administrador, quero manter instituições pré-cadastradas para vincular alunos e professores. | O aluno deve selecionar uma instituição existente. | ✅ Sprint 02 |
| HU17 | Como administrador, quero manter professores pré-cadastrados representando os docentes das instituições. | Cada professor deve possuir nome, CPF, departamento e instituição. | ⏳ Sprint 03 |
| HU18 | Como sistema, quero enviar notificações por e-mail em eventos importantes. | O envio deve ocorrer ao receber moedas e ao resgatar vantagens. | ⏳ Sprint 03 |

---

## 🎥 Diagramas

### Diagrama de Casos de Uso

<img width="700" alt="Diagrama de casos de uso do Sistema de Moeda Estudantil" src="docs/diagramas/casos-de-uso/Diagrama%20casos%20de%20uso-%20lab%20projeto.jpeg"/>

### Diagrama de Classes

<img width="700" alt="Diagrama de classes do Sistema de Moeda Estudantil" src="docs/diagramas/diagrama-de-classes/Diagrama%20de%20Classe-%20Lab%20projeto.jpeg"/>

### Diagrama de Componentes

> Em elaboração — Sprint 01. Arquivo `.drawio` disponível em `docs/diagramas/componentes/`.

### Modelo ER

> Implementado como `backend/prisma/schema.prisma` — Sprint 02. O arquivo contém todas as entidades, relacionamentos e enums do sistema.

### Diagrama de Arquitetura

> Em elaboração — Sprint 03.

---

## 🔗 Documentações Utilizadas

- [**Laboratório de Desenvolvimento de Software — PUC Minas**](https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software)
- [**Template README — Prof. João Paulo Aramuni**](https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software/blob/main/TEMPLATES/template_README.md)
- [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/)
- [**Node.js — Documentação Oficial**](https://nodejs.org/en/docs)
- [**Express — Documentação Oficial**](https://expressjs.com/)
- [**Prisma — Documentação Oficial**](https://www.prisma.io/docs)
- [**Zod — Documentação Oficial**](https://zod.dev/)
- [**React — Documentação Oficial**](https://react.dev/)
- [**Vite — Documentação Oficial**](https://vitejs.dev/guide/)
- [**Tailwind CSS — Documentação Oficial**](https://tailwindcss.com/docs)
- [**React Hook Form — Documentação Oficial**](https://react-hook-form.com/)
- [**Axios — Documentação Oficial**](https://axios-http.com/docs/intro)
- [**PostgreSQL — Documentação Oficial**](https://www.postgresql.org/docs/)
- [**Docker Compose — Documentação Oficial**](https://docs.docker.com/compose/)

---

## 👥 Autores

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
|---------|----------|-----------------|-------------|-----------|
| A preencher | — | — | — | — |

---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças seguindo [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (`git commit -m 'feat: Adiciona nova funcionalidade X'`).
4. Faça o `push` para a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request (PR)**.

---

## 🙏 Agradecimentos

- [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) — Pelo apoio institucional e fomento à inovação e boas práticas de engenharia.
- [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) — Pelos ensinamentos sobre Arquitetura de Software e Padrões de Projeto.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](LICENSE)**.
