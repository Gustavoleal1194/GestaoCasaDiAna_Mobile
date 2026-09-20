# Termo de Uso de Inteligência Artificial Generativa

## Identificação

- **Projeto:** Casa di Ana Mobile
- **Aluno(a):** Gustavo Idalgo Capistrano Leal
- **Curso/Período:** Sistemas de Informação — 8º termo
- **Disciplina:** Desenvolvimento Mobile
- **Professor(a):** Lenon Fachiano
- **Ferramenta de IA utilizada:** Claude Code (Anthropic), modelo Claude Sonnet 5
- **Repositório:** https://github.com/Gustavoleal1194/GestaoCasaDiAna_Mobile
- **Data:** 2026-09-20

---

## Escopo deste termo

Este projeto usa como base de padrões de código o projeto de referência apresentado em sala (TaskApp), incluindo sua estrutura de componente (`type Props`, `function` declarada, `StyleSheet.create` ao final do arquivo), nomenclatura em português, organização de pastas (`components/`, `models/`) e estilo de validação. **Esses padrões, por já terem sido ensinados e demonstrados no projeto de referência, não são declarados como conteúdo gerado por IA neste termo.**

Este termo declara **apenas os elementos técnicos e funcionais que vão além do que o projeto de referência ensina** — ou seja, funcionalidades, integrações e decisões de arquitetura que não têm equivalente no projeto do professor e foram desenvolvidas com apoio de IA generativa especificamente para este trabalho.

---

## Elementos desenvolvidos com apoio de IA generativa

1. **Integração com a API REST do sistema Casa di Ana** — camada de serviços (`services/`) que consome os endpoints reais do backend em produção, incluindo mapeamento dos contratos de dados (modelos em `models/`) e tratamento do envelope de resposta da API.

2. **Sistema de autenticação** — login contra a API real, persistência de sessão no dispositivo (AsyncStorage) e fluxo completo de autenticação de dois fatores (2FA), inexistente no projeto de referência.

3. **Navegação por menu lateral** — implementação com React Navigation (Drawer), incluindo conteúdo customizado do menu. O projeto de referência é uma aplicação de tela única, sem navegação.

4. **Componentes de interface sem equivalente no projeto de referência** — `Selecionador`, `CampoTexto`, `MensagemErro`, `TituloSecao`, `ListaVazia`, `TextoDetalhe`, `BotaoAcao` e `TelaLista` (este último, um componente genérico que encapsula o padrão de tela com lista e formulário usado em todos os módulos).

5. **Módulo de Cadastro** — CRUD completo (criar, listar, editar, desativar) de Produtos e Ingredientes, com seleção de categoria e unidade de medida.

6. **Identidade visual** — sistema de cores e tipografia (`theme/`) construído a partir da paleta e fontes do sistema web já existente da Casa di Ana, aplicado de forma consistente nos componentes da interface.

7. **Configuração de dependências e do ambiente** — integração de bibliotecas não presentes no projeto de referência (React Navigation, AsyncStorage, `expo-linear-gradient`, Google Fonts) e ajustes de configuração do Expo (`app.json`) específicos para viabilizar essas funcionalidades.

8. **Documentação do projeto** — redação do `README.md` do repositório.

---

## Nível de intervenção humana

Todo o código e conteúdo gerado com apoio da ferramenta de IA foi revisado, testado e validado antes de ser incorporado ao projeto — incluindo testes reais do aplicativo (via Expo Go) contra a API do sistema em produção, cobrindo login, autenticação de dois fatores e os módulos funcionais.

## Declaração de responsabilidade

Declaro que compreendo integralmente o funcionamento do código presente neste repositório e assumo total responsabilidade pelo conteúdo final entregue.

**Gustavo Idalgo Capistrano Leal**
