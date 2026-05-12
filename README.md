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

[![Versão](https://img.shields.io/badge/Versão-Lab03S02-blue?style=for-the-badge)](https://github.com/)
![Sprint](https://img.shields.io/badge/Sprint-Lab03S02-6d28d9?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20Prisma-339933?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-61DAFB?style=for-the-badge)
![DB](https://img.shields.io/badge/Banco-PostgreSQL-4169E1?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software?style=for-the-badge&color=007ec6&logo=opensourceinitiative)

---

## 📚 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Modelo de Dados](#-modelo-de-dados)
- [Instalação e Execução](#-instalação-e-execução)
- [Rotas da API](#-rotas-da-api)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Status Lab03S02](#-status-lab03s02)
- [User Stories](#-user-stories)
- [Diagramas](#-diagramas)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 📝 Sobre o Projeto

O **Sistema de Moeda Estudantil** é uma aplicação web Full-Stack projetada para fomentar o mérito acadêmico por meio de uma moeda virtual gerenciada dentro do ambiente institucional.

- **Por que ele existe:** Surgiu da necessidade de criar um canal formal e rastreável para que professores reconheçam bons comportamentos e desempenhos de alunos.
- **Qual problema ele resolve:** Centraliza a distribuição e o resgate de moedas estudantis, garantindo reconhecimento de mérito, transparência financeira e ecossistema de vantagens.
- **Contexto:** Disciplina de Laboratório de Desenvolvimento de Software — PUC Minas.

---

## 🛠 Tecnologias Utilizadas

| Camada         | Tecnologias                                                            |
| -------------- | ---------------------------------------------------------------------- |
| Front-end      | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, React Router v6 |
| Formulários    | React Hook Form, Zod                                                   |
| HTTP Client    | Axios                                                                  |
| Back-end       | Node.js 20, Express, TypeScript                                        |
| ORM            | Prisma 5                                                               |
| Banco de dados | PostgreSQL 16                                                          |
| Infraestrutura | Docker, Docker Compose                                                 |
| Validação      | Zod (back + front)                                                     |

---

## 🏗 Arquitetura

```
Frontend (React/Vite :5173)
    └── Axios → /api/* (proxy Vite)
         └── Backend (Express :3333)
              └── Controller → Service → Repository → Prisma → PostgreSQL
```

### Camadas do backend

| Camada     | Responsabilidade                                    |
|------------|-----------------------------------------------------|
| Controller | Recebe request, chama service, retorna response     |
| Service    | Valida regras de negócio (unicidade, existência)    |
| Repository | Acessa banco via Prisma, sem regra de negócio       |
| Prisma     | ORM — mapeia entidades, gera SQL, gerencia migrations|

---

## 🗄 Modelo de Dados

### Entidades implementadas na Sprint Lab03S02

```
Usuario         → id, nome, email, senhaHash, tipo, createdAt, updatedAt
Instituicao     → id, nome, createdAt, updatedAt
Aluno           → id, nome, email, cpf, rg, endereco, curso, saldoMoedas(=0), instituicaoId, usuarioId?
EmpresaParceira → id, nome, email, cnpj, endereco, telefone?, status(ATIVA/INATIVA), usuarioId?
```

### Entidades no schema (implementação futura)

```
Professor       → id, nome, cpf, departamento, saldoMoedas(=1000), instituicaoId, usuarioId?
Vantagem        → id, titulo, descricao, fotoUrl?, custoMoedas, empresaParceiraId
TransacaoMoeda  → id, tipo, valor, motivo, alunoId, professorId?, vantagemId?
Resgate         → id, codigoCupom, status, alunoId, vantagemId
```

---

## 🔧 Instalação e Execução

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
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

Isso sobe um container PostgreSQL na porta `5432` com:
- **Usuário:** `postgres`
- **Senha:** `postgres`
- **Banco:** `moeda_estudantil`

### 3. Configure e inicie o back-end

```bash
cd backend
npm install
# Copie o arquivo de variáveis de ambiente:
copy .env.example .env
# Rode a migration e crie as tabelas:
npx prisma migrate dev
# Popule com dados iniciais (5 instituições):
npx prisma db seed
# Inicie o servidor:
npm run dev
```

O backend estará em: **http://localhost:3333**

### 4. Inicie o front-end

```bash
cd ../frontend
npm install
npm run dev
```

O frontend estará em: **http://localhost:5173**

### 5. Acesse o sistema

Abra **http://localhost:5173** e entre com qualquer e-mail e senha.

> **Nota:** A autenticação real (JWT) será implementada na Sprint Lab03S03.

---

## 🔌 Rotas da API

Base URL: `http://localhost:3333/api`

### Health Check
| Método | Rota          | Descrição          |
|--------|---------------|--------------------|
| GET    | `/health`     | Verifica se a API está rodando |

### Alunos — `GET/POST/PUT/DELETE /alunos`
| Método | Rota           | Descrição                    |
|--------|----------------|------------------------------|
| GET    | `/alunos`      | Lista todos (query: `search`) |
| GET    | `/alunos/:id`  | Busca por ID                 |
| POST   | `/alunos`      | Cria novo aluno              |
| PUT    | `/alunos/:id`  | Atualiza aluno               |
| DELETE | `/alunos/:id`  | Remove aluno                 |

### Empresas Parceiras — `GET/POST/PUT/DELETE /empresas-parceiras`
| Método | Rota                        | Descrição             |
|--------|-----------------------------|-----------------------|
| GET    | `/empresas-parceiras`       | Lista todas           |
| GET    | `/empresas-parceiras/:id`   | Busca por ID          |
| POST   | `/empresas-parceiras`       | Cria nova empresa     |
| PUT    | `/empresas-parceiras/:id`   | Atualiza empresa      |
| DELETE | `/empresas-parceiras/:id`   | Remove empresa        |

### Instituições — `GET/POST/PUT/DELETE /instituicoes`
| Método | Rota               | Descrição             |
|--------|--------------------|-----------------------|
| GET    | `/instituicoes`    | Lista todas           |
| GET    | `/instituicoes/:id`| Busca por ID          |
| POST   | `/instituicoes`    | Cria nova instituição |
| PUT    | `/instituicoes/:id`| Atualiza instituição  |
| DELETE | `/instituicoes/:id`| Remove instituição    |

### Dashboard
| Método | Rota         | Descrição                                  |
|--------|--------------|--------------------------------------------|
| GET    | `/dashboard` | Totais + últimos 5 alunos e 5 empresas     |

---

## 📂 Estrutura de Pastas

```
SistemaMoedaEstudantil/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          ← Modelo de dados completo
│   │   ├── seed.ts                ← Dados iniciais
│   │   └── migrations/            ← Histórico de migrations
│   ├── src/
│   │   ├── controllers/           ← Recebe requisições HTTP
│   │   ├── services/              ← Regras de negócio
│   │   ├── repositories/          ← Acesso ao banco (Prisma)
│   │   ├── routes/                ← Definição de rotas Express
│   │   ├── validators/            ← Schemas Zod
│   │   ├── middlewares/           ← Error handler
│   │   ├── lib/prisma.ts          ← Singleton PrismaClient
│   │   └── server.ts              ← Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            ← Layout, Sidebar, Header
│   │   │   └── ui/                ← Button, Input, Modal, Badge...
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── alunos/            ← AlunosList, AlunoForm
│   │   │   ├── empresas/          ← EmpresasList, EmpresaForm
│   │   │   └── instituicoes/      ← InstituicoesList
│   │   ├── services/              ← Axios + chamadas à API
│   │   ├── types/index.ts         ← Tipos TypeScript
│   │   ├── App.tsx                ← Rotas React Router
│   │   └── main.tsx
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── docs/
│   └── diagramas/                 ← Casos de uso, Classes, ER
├── docker-compose.yml             ← PostgreSQL 16
├── .gitignore
└── README.md
```

---

## ✅ Status Lab03S02

| Item                                          | Status |
|-----------------------------------------------|--------|
| Modelo ER criado (schema.prisma)              | ✅     |
| Migration aplicada                            | ✅     |
| Estratégia de persistência: Prisma + Repos    | ✅     |
| CRUD Aluno (Controller/Service/Repository)    | ✅     |
| CRUD Empresa Parceira                         | ✅     |
| CRUD Instituição                              | ✅     |
| Validações Zod (back + front)                 | ✅     |
| Regras de negócio (email único, CPF único)    | ✅     |
| Rotas REST padronizadas `/api/*`              | ✅     |
| Front-end React + Vite + Tailwind             | ✅     |
| Tela de Login                                 | ✅     |
| Dashboard com cards e últimos cadastros       | ✅     |
| Tela de Alunos (listagem + busca + CRUD)      | ✅     |
| Tela de Empresas Parceiras (listagem + CRUD)  | ✅     |
| Tela de Instituições                          | ✅     |
| Integração real front ↔ back via Axios        | ✅     |
| Seed com 5 instituições                       | ✅     |
| Docker Compose para PostgreSQL                | ✅     |

### Para Sprint Lab03S03 (próximos passos)

| Item                                        |
|---------------------------------------------|
| Autenticação JWT (login real)               |
| CRUD de Professores                         |
| Distribuição de moedas                      |
| Extrato de transações                       |
| Cadastro de vantagens por empresa           |
| Resgate de vantagens + cupons               |
| Notificações por e-mail                     |

---

## 👥 User Stories

### Aluno

| ID   | História do Usuário                                                                              | Status Lab03S02 |
| ---- | ------------------------------------------------------------------------------------------------ | --------------- |
| HU01 | Como aluno, quero me cadastrar no sistema para participar do programa de moeda estudantil.       | ✅ Implementado |
| HU02 | Como aluno, quero fazer login para acessar minhas funcionalidades com segurança.                 | 🔄 Login visual (auth real Sprint 03) |
| HU03 | Como aluno, quero consultar meu saldo para saber quantas moedas possuo.                          | 🔄 Sprint 03 |
| HU04 | Como aluno, quero consultar meu extrato para acompanhar moedas recebidas e vantagens resgatadas. | 🔄 Sprint 03 |
| HU05 | Como aluno, quero visualizar vantagens disponíveis para escolher onde gastar minhas moedas.      | 🔄 Sprint 03 |
| HU06 | Como aluno, quero resgatar uma vantagem para trocar minhas moedas por benefícios.                | 🔄 Sprint 03 |
| HU07 | Como aluno, quero receber um e-mail com o cupom para apresentar na troca presencial.             | 🔄 Sprint 03 |

### Empresa Parceira

| ID   | História do Usuário                                                                                     | Status Lab03S02 |
| ---- | ------------------------------------------------------------------------------------------------------- | --------------- |
| HU13 | Como empresa parceira, quero me cadastrar no sistema para oferecer vantagens aos alunos.                | ✅ Implementado |
| HU14 | Como empresa parceira, quero cadastrar vantagens para que alunos possam resgatá-las.                    | 🔄 Sprint 03 |
| HU15 | Como empresa parceira, quero receber um e-mail quando uma vantagem for resgatada para conferir a troca. | 🔄 Sprint 03 |

### Administrador

| ID   | História do Usuário                                                                                                              | Status Lab03S02 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| HU16 | Como administrador, quero manter instituições pré-cadastradas para que alunos e professores sejam vinculados corretamente.       | ✅ Implementado |

---

## 🎥 Diagramas

### Diagrama de Casos de Uso

<img width="700" alt="Diagrama de casos de uso do Sistema de Moeda Estudantil" src="docs/diagramas/casos-de-uso/Diagrama%20casos%20de%20uso-%20lab%20projeto.jpeg"/>

### Diagrama de Classes

<img width="700" alt="Diagrama de classes do Sistema de Moeda Estudantil" src="docs/diagramas/diagrama-de-classes/Diagrama%20de%20Classe-%20Lab%20projeto.jpeg"/>

### Modelo ER
> Implementado como `backend/prisma/schema.prisma` — Sprint Lab03S02.

### Diagrama de Arquitetura
> Em elaboração — Sprint Lab03S03.

---

## 🔗 Documentações Utilizadas

- [**Laboratório de Desenvolvimento de Software — PUC Minas**](https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software)
- [**Prisma ORM**](https://www.prisma.io/docs)
- [**Express.js**](https://expressjs.com/)
- [**React**](https://react.dev/)
- [**Tailwind CSS**](https://tailwindcss.com/)
- [**Vite**](https://vitejs.dev/)
- [**Zod**](https://zod.dev/)
- [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 👥 Autores

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
|---------|----------|-----------------|-------------|-----------|
| A preencher | — | — | — | — |

---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`).
4. Faça o `push` para a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request (PR)**.

---

## 🙏 Agradecimentos

- [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) — Pelo apoio institucional.
- [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) — Pelos ensinamentos sobre Arquitetura de Software e Padrões de Projeto.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](LICENSE)**.
