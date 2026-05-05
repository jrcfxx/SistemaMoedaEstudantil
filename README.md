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

[![Versão](https://img.shields.io/badge/Versão-Release%201-blue?style=for-the-badge)](https://github.com/) ![Stack](https://img.shields.io/badge/Stack-a%20definir-lightgrey?style=for-the-badge) ![GitHub license](https://img.shields.io/github/license/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software?style=for-the-badge&color=007ec6&logo=opensourceinitiative)

---

## 📚 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
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

A pilha tecnológica será definida pelo grupo e documentada aqui (incluindo tutorial na Sprint 03). O roteiro do laboratório pede **arquitetura MVC**, persistência com modelo ER e estratégia de acesso a dados (por exemplo ORM ou DAO), sem fixar linguagem ou framework no back-end.

| Camada        | Tecnologias        |
| ------------- | ------------------ |
| Front-end     | A definir          |
| Back-end      | A definir          |
| Banco de dados | A definir         |
| Outras (auth, e-mail, etc.) | A definir |

---

## 🔧 Instalação e Execução

### Pré-requisitos

Dependem da stack escolhida (runtime, gerenciador de pacotes, banco, etc.). Após definir as tecnologias, esta lista será atualizada.

- IDE ou editor de sua preferência.
- Navegador atualizado (para testar a interface web).

### 📦 Instalação de Dependências e Como Executar a Aplicação

> ⚠️ Esta seção será atualizada ao longo das sprints conforme a stack for definida e implementada.

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/SistemaMoedaEstudantil.git
   ```
2. Acesse a pasta do projeto e instale as dependências.
3. Configure as variáveis de ambiente (banco de dados, e-mail, etc.).
4. Execute a aplicação.

---

## 📂 Estrutura de Pastas

> ⚠️ A estrutura será detalhada conforme o desenvolvimento avança nas sprints.

```
SistemaMoedaEstudantil/
├── docs/
│   └── diagramas/
│       ├── casos-de-uso/
│       ├── diagrama-de-classes/
│       ├── componentes/
│       ├── modelo-er/
│       └── arquitetura/
├── src/                   # Código-fonte (a definir conforme stack)
├── README.md
└── LICENSE
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
