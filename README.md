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

[![Versão](https://img.shields.io/badge/Versão-Release%201-blue?style=for-the-badge)](https://github.com/) ![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20PostgreSQL-339933?style=for-the-badge) ![GitHub license](https://img.shields.io/github/license/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software?style=for-the-badge&color=007ec6&logo=opensourceinitiative)

---

## 📚 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Incrementos de Desenvolvimento](#-incrementos-de-desenvolvimento)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação de Dependências e Como Executar a Aplicação](#-instalação-de-dependências-e-como-executar-a-aplicação)
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

- **Por que ele existe:**
  Surgiu da necessidade de criar um canal formal e rastreável para que professores reconheçam bons comportamentos e desempenhos de alunos, substituindo elogios informais por um sistema de recompensas concreto e mensurável.

- **Qual problema ele resolve:**
  O sistema centraliza a distribuição e o resgate de moedas estudantis, garantindo:
  - **Reconhecimento de Mérito:** Professores enviam moedas com mensagem de reconhecimento obrigatória.
  - **Transparência Financeira:** Extrato de conta para alunos e professores, com histórico completo de transações.
  - **Ecossistema de Vantagens:** Empresas parceiras cadastram benefícios que os alunos podem resgatar com suas moedas.
  - **Notificações Automáticas:** E-mails enviados ao aluno ao receber moedas e ao resgatar vantagens, com geração de cupom com código único.

- **Qual o contexto:**
  Desenvolvido em ambiente acadêmico na disciplina de Laboratório de Desenvolvimento de Software da PUC Minas. O projeto aplica boas práticas de Engenharia de Software com arquitetura **MVC**, desenvolvimento **Full-Stack** e modelagem **UML** completa.

- **Onde ele pode ser utilizado:**
  - **Instituições de Ensino:** Como plataforma de incentivo ao mérito estudantil, integrando professores, alunos e parceiros.
  - **Empresas Parceiras:** Como canal para oferecer descontos e benefícios ao público estudantil.
  - **Portfólio Acadêmico:** Como case de estudo prático de desenvolvimento Full-Stack com integração entre sistemas.

---

## ✨ Funcionalidades Principais

- 👤 **Gestão de Alunos (CRUD):** Cadastro com nome, e-mail, CPF, RG, endereço, instituição e curso. Área de perfil para consulta e atualização de dados.
- 🏫 **Gestão de Professores:** Professores pré-cadastrados pelas instituições recebem 1.000 moedas por semestre (saldo acumulável).
- 🏢 **Gestão de Empresas Parceiras (CRUD):** Empresas se cadastram e oferecem vantagens com descrição, foto e custo em moedas.
- 💰 **Distribuição de Moedas:** Professor envia moedas a um aluno com motivo obrigatório, validando saldo antes da transação.
- 🎁 **Resgate de Vantagens:** Aluno seleciona uma vantagem, tem o saldo descontado e recebe cupom por e-mail com código único.
- 📋 **Extrato de Conta:** Alunos e professores consultam histórico completo de transações (envios, recebimentos e resgates).
- 📧 **Notificações por E-mail:** Envio automático ao aluno ao receber moedas e ao resgatar vantagem; envio ao parceiro com código de validação.
- 🔒 **Autenticação:** Login com e-mail e senha para alunos, professores e empresas parceiras.

---

## 🛠 Tecnologias Utilizadas

A stack foi escolhida com foco em produtividade, TypeScript unificado em toda a aplicação e alinhamento com a arquitetura **MVC** exigida pelo laboratório.

| Camada | Tecnologia | Justificativa |
| --- | --- | --- |
| **Runtime back-end** | [Node.js 20](https://nodejs.org/) | Runtime leve, não-blocante, amplamente adotado no mercado |
| **Framework back-end** | [Express](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/) | Framework MVC minimalista; TypeScript unifico com o front-end |
| **ORM / Persistência** | [Prisma](https://www.prisma.io/) | ORM moderno com schema tipado, migrations automáticas e excelente DX |
| **Banco de Dados** | [PostgreSQL](https://www.postgresql.org/) | Banco relacional robusto para transações de moedas e joins complexos |
| **Validação** | [Zod](https://zod.dev/) | Schema de validação compartilhável entre back-end e front-end |
| **Front-end** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/) | SPA moderna, tipagem estática, build rápido |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/) | Utilitário CSS — produtividade alta sem CSS manual |
| **Componentes UI** | [shadcn/ui](https://ui.shadcn.com/) | Componentes acessíveis, personalizáveis, baseados em Radix UI |
| **Formulários** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Formulários performáticos com validação integrada |
| **HTTP client** | [Axios](https://axios-http.com/) | Cliente HTTP com interceptors, tratamento de erros centralizado |
| **Ícones** | [Lucide React](https://lucide.dev/) | Biblioteca de ícones SVG moderna e tree-shakeable |
| **Autenticação** | JWT ([jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)) | Autenticação stateless para API REST — implementada na Sprint 03 |
| **E-mail** | [Nodemailer](https://nodemailer.com/) | Envio de notificações e cupons — implementado na Sprint 03 |
| **Containerização** | [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) | Sobe PostgreSQL localmente sem instalação manual |
| **Controle de Versão** | [Git](https://git-scm.com/) + [GitHub](https://github.com/) | Versionamento e colaboração da equipe |

---

## 📈 Incrementos de Desenvolvimento

Cada incremento representa uma entrega funcional ou artefato de projeto vinculado a uma sprint. O desenvolvimento segue as entregas definidas no roteiro do laboratório (**Lab03S01**, **Lab03S02** e **Lab03S03**).

| # | Incremento | Sprint | Status |
|---|-----------|--------|--------|
| 1 | Diagrama de Casos de Uso | Sprint 01 | ✅ Concluído |
| 2 | Histórias do Usuário (User Stories) | Sprint 01 | ✅ Concluído |
| 3 | Diagrama de Classes | Sprint 01 | ✅ Concluído |
| 4 | Diagrama de Componentes | Sprint 01 | ✅ Concluído |
| 5 | Modelo ER (Entidade-Relacionamento) | Sprint 02 | ⏳ Pendente |
| 6 | Configuração do banco de dados (PostgreSQL + Docker) | Sprint 02 | ✅ Concluído |
| 7 | Camada de persistência com Prisma ORM (schema + migrations) | Sprint 02 | ✅ Concluído |
| 8 | CRUD de Aluno — back-end (API REST) | Sprint 02 | ✅ Concluído |
| 9 | CRUD de Empresa Parceira — back-end (API REST) | Sprint 02 | ✅ Concluído |
| 10 | CRUD de Aluno — front-end (React + integração com API) | Sprint 02 | ⏳ Pendente |
| 11 | CRUD de Empresa Parceira — front-end (React + integração com API) | Sprint 02 | ⏳ Pendente |
| 12 | CRUD de Aluno e Empresa Parceira — versão final (refinamentos) | Sprint 03 | ⏳ Pendente |
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

- [Node.js 20+](https://nodejs.org/) e [npm](https://www.npmjs.com/) — runtime do back-end e do front-end
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) — para subir o PostgreSQL localmente
- IDE de sua preferência (recomendado: [VS Code](https://code.visualstudio.com/) ou [Cursor](https://www.cursor.com/))
- Navegador atualizado

### 📦 Instalação de Dependências e Como Executar a Aplicação

> ⚠️ Esta seção será detalhada a partir da Sprint 02, quando o código será implementado.

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/SistemaMoedaEstudantil.git
   ```
2. Suba o banco de dados com Docker:
   ```bash
   docker-compose up -d
   ```
3. Configure as variáveis de ambiente do back-end:
   ```bash
   cd backend
   cp .env.example .env
   # edite o .env com a URL do banco e demais configs
   ```
4. Instale as dependências e rode as migrations:
   ```bash
   npm install
   npx prisma migrate dev
   npx prisma db seed   # opcional: dados iniciais (instituições)
   ```
5. Execute o back-end:
   ```bash
   npm run dev
   # servidor disponível em http://localhost:3333
   ```
6. Em outro terminal, execute o front-end:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   # aplicação disponível em http://localhost:5173
   ```

---

## 📂 Estrutura de Pastas

> ⚠️ A estrutura será detalhada conforme o desenvolvimento avança nas sprints.

```
SistemaMoedaEstudantil/
├── backend/                            # Node.js + Express + TypeScript
│   ├── prisma/
│   │   ├── schema.prisma               # Definição do modelo de dados
│   │   └── seed.ts                     # Dados iniciais (instituições, etc.)
│   ├── src/
│   │   ├── controllers/                # Camada MVC — recebem requisições HTTP
│   │   │   ├── alunoController.ts
│   │   │   ├── empresaParceiraController.ts
│   │   │   └── instituicaoController.ts
│   │   ├── services/                   # Regras de negócio
│   │   │   ├── alunoService.ts
│   │   │   ├── empresaParceiraService.ts
│   │   │   └── instituicaoService.ts
│   │   ├── repositories/               # Acesso ao banco via Prisma
│   │   │   ├── alunoRepository.ts
│   │   │   ├── empresaParceiraRepository.ts
│   │   │   └── instituicaoRepository.ts
│   │   ├── routes/                     # Definição das rotas REST
│   │   ├── middlewares/                # Tratamento de erros, auth, etc.
│   │   ├── validators/                 # Schemas Zod de validação
│   │   ├── lib/
│   │   │   └── prisma.ts               # Singleton do PrismaClient
│   │   └── server.ts                   # Entry point do servidor
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                           # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/                 # Layout, Sidebar, Header
│   │   │   └── ui/                     # Componentes shadcn/ui e customizados
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── alunos/                 # AlunosList + AlunoForm
│   │   │   └── empresas/              # EmpresasList + EmpresaForm
│   │   ├── services/                   # Chamadas HTTP via Axios
│   │   ├── types/                      # Tipagens TypeScript compartilhadas
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                               # Artefatos UML e diagramas
│   └── diagramas/
│       ├── casos-de-uso/
│       ├── diagrama-de-classes/
│       ├── componentes/
│       ├── modelo-er/
│       └── arquitetura/
├── docker-compose.yml                  # PostgreSQL local
├── README.md
└── LICENSE
```

> ⚠️ A estrutura de código será criada a partir da Sprint 02.

---

## 🗄️ Modelo de Dados

As entidades abaixo compõem o schema Prisma. O CRUD completo das entidades marcadas com ⭐ é entregue na Sprint 02; as demais ficam no schema para uso na Sprint 03.

| Entidade | Sprint | Descrição |
|----------|--------|-----------|
| `Instituicao` ⭐ | Sprint 02 | Instituições de ensino pré-cadastradas; alunos e professores se vinculam a elas |
| `Aluno` ⭐ | Sprint 02 | Dados do aluno: nome, CPF, RG, e-mail, endereço, curso, saldo de moedas |
| `EmpresaParceira` ⭐ | Sprint 02 | Empresas que oferecem vantagens; cadastro com CNPJ, e-mail e status |
| `Usuario` | Sprint 03 | Entidade de autenticação (e-mail + senha hash + tipo: ALUNO/PROFESSOR/EMPRESA) |
| `Professor` | Sprint 03 | Docente pré-cadastrado; recebe 1.000 moedas/semestre (saldo acumulável) |
| `Vantagem` | Sprint 03 | Produto ou desconto oferecido por empresa parceira (título, descrição, foto, custo) |
| `TransacaoMoeda` | Sprint 03 | Histórico de envios e resgates de moedas (tipo: ENVIO / RECEBIMENTO / RESGATE) |
| `Resgate` | Sprint 03 | Registro de resgate de vantagem com código de cupom único gerado pelo sistema |

### Relacionamentos principais

```
Instituicao ──< Aluno
Instituicao ──< Professor
Usuario ──── Aluno          (1:1)
Usuario ──── Professor      (1:1)
Usuario ──── EmpresaParceira (1:1)
EmpresaParceira ──< Vantagem
Aluno ──< TransacaoMoeda
Professor ──< TransacaoMoeda
Vantagem ──< TransacaoMoeda
Aluno ──< Resgate
Vantagem ──< Resgate
```

---

## 👥 User Stories

### Aluno

| ID   | História do Usuário                                                                              | Critérios de Aceitação                                                          |
| ---- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| HU01 | Como aluno, quero me cadastrar no sistema para participar do programa de moeda estudantil.       | Deve informar nome, e-mail, CPF, RG, endereço, instituição e curso.             |
| HU02 | Como aluno, quero fazer login para acessar minhas funcionalidades com segurança.                 | O sistema deve validar e-mail e senha antes de liberar acesso.                  |
| HU03 | Como aluno, quero consultar meu saldo para saber quantas moedas possuo.                          | O sistema deve exibir o saldo atualizado.                                       |
| HU04 | Como aluno, quero consultar meu extrato para acompanhar moedas recebidas e vantagens resgatadas. | O extrato deve listar data, tipo da transação, valor e descrição.               |
| HU05 | Como aluno, quero visualizar vantagens disponíveis para escolher onde gastar minhas moedas.      | O sistema deve listar vantagens com descrição, foto, empresa e custo em moedas. |
| HU06 | Como aluno, quero resgatar uma vantagem para trocar minhas moedas por benefícios.                | O sistema deve validar saldo, descontar moedas e gerar um código de cupom.      |
| HU07 | Como aluno, quero receber um e-mail com o cupom para apresentar na troca presencial.             | O e-mail deve conter o código gerado pelo sistema e dados da vantagem.          |

### Professor

| ID   | História do Usuário                                                                                   | Critérios de Aceitação                                                      |
| ---- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| HU08 | Como professor, quero fazer login para acessar minha conta no sistema.                                | O sistema deve autenticar professor pré-cadastrado.                         |
| HU09 | Como professor, quero receber 1.000 moedas por semestre para distribuir aos alunos.                   | O saldo semestral deve ser acumulado ao saldo existente.                    |
| HU10 | Como professor, quero enviar moedas a um aluno para reconhecer seu mérito.                            | Deve selecionar aluno, informar quantidade e motivo obrigatório.            |
| HU11 | Como professor, quero que o sistema valide meu saldo antes do envio para evitar transações inválidas. | A transação só deve ocorrer se houver saldo suficiente.                     |
| HU12 | Como professor, quero consultar meu extrato para ver as moedas que distribuí.                         | O extrato deve mostrar envios realizados, alunos, valores, datas e motivos. |

### Empresa Parceira

| ID   | História do Usuário                                                                                     | Critérios de Aceitação                                                |
| ---- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| HU13 | Como empresa parceira, quero me cadastrar no sistema para oferecer vantagens aos alunos.                | Deve informar dados da empresa, login e senha.                        |
| HU14 | Como empresa parceira, quero cadastrar vantagens para que alunos possam resgatá-las.                    | Deve informar título, descrição, foto e custo em moedas.              |
| HU15 | Como empresa parceira, quero receber um e-mail quando uma vantagem for resgatada para conferir a troca. | O e-mail deve conter código de validação, aluno e vantagem resgatada. |

### Administrador / Sistema

| ID   | História do Usuário                                                                                                              | Critérios de Aceitação                                             |
| ---- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| HU16 | Como administrador, quero manter instituições pré-cadastradas para que alunos e professores sejam vinculados corretamente.       | O aluno deve selecionar uma instituição existente.                 |
| HU17 | Como administrador, quero manter professores pré-cadastrados para representar os docentes enviados pelas instituições parceiras. | Cada professor deve possuir nome, CPF, departamento e instituição. |
| HU18 | Como sistema, quero enviar notificações por e-mail para alunos e empresas em eventos importantes.                                | O envio deve ocorrer ao receber moedas e ao resgatar vantagens.    |

---

## 🎥 Diagramas

As imagens abaixo vêm dos arquivos em `docs/diagramas/` (casos de uso e diagrama de classes).

### Diagrama de Casos de Uso

<img width="700" alt="Diagrama de casos de uso do Sistema de Moeda Estudantil" src="docs/diagramas/casos-de-uso/Diagrama%20casos%20de%20uso-%20lab%20projeto.jpeg"/>

### Diagrama de Classes

<img width="700" alt="Diagrama de classes do Sistema de Moeda Estudantil" src="docs/diagramas/diagrama-de-classes/Diagrama%20de%20Classe-%20Lab%20projeto.jpeg"/>


### Diagrama de Componentes
> Em elaboração — Sprint 01.

### Modelo ER
> Em elaboração — Sprint 02.

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
- [**shadcn/ui — Documentação Oficial**](https://ui.shadcn.com/docs)
- [**React Hook Form — Documentação Oficial**](https://react-hook-form.com/get-started)
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
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`). **(Utilize [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))**
4. Faça o `push` para a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request (PR)**.

---

## 🙏 Agradecimentos

- [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) — Pelo apoio institucional e fomento à inovação e boas práticas de engenharia.
- [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) — Pelos ensinamentos sobre **Arquitetura de Software** e **Padrões de Projeto**.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](LICENSE)**.
