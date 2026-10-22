# Checkpoint 03 — fechamento dos requisitos

## Intenção

Entrega final do Projeto Integrador. O app já cobre quase todo o enunciado; este trabalho fecha as lacunas que o professor pode pedir para demonstrar ou explicar:

1. Transferência de parâmetros entre telas e retorno às telas anteriores.
2. Feedback visual de ações concluídas.
3. Erros de validação (números e datas).
4. Resposta HTTP 401 (sessão expirada) e o "pisca" da tela de login ao restaurar a sessão.
5. Documentação final (README do Checkpoint 03, execução de app / WebAPI / banco) e Termo de IA atualizado.

A demonstração será feita pelo Expo Go (o modo web é bloqueado por CORS na API).

## Objetivos / não-objetivos / anti-objetivos

- **Objetivo:** todos os requisitos do enunciado demonstráveis, sem regressão no que já funciona.
- **Não-objetivo:** mexer no backend, criar novos módulos, testes automatizados (o projeto não tem infraestrutura de testes; a verificação é `tsc` + bundle + teste manual no Expo Go).
- **Anti-objetivo:** reescrever o padrão das telas existentes (`TelaLista` + formulário no cabeçalho) além do necessário; código que o aluno não consiga explicar.

## Decisões do usuário

- No Cadastro, tocar num produto/ingrediente abre **uma tela própria do item** com detalhes e as ações Editar/Excluir.
- Cadastrar item novo: **botão "Novo produto" / "Novo ingrediente"** na lista, que abre **o mesmo formulário** usado na edição.
- Após isso: "apenas cumpra todos os requisitos" — demais decisões ficam a cargo do construtor (marcadas abaixo como *decisão do construtor*).

## Abordagens consideradas (navegação)

| Abordagem | Prós | Contras |
|---|---|---|
| **A. Stack aninhado só no Cadastro** (drawer → `CadastroNavigator` com Lista / Detalhe / Formulário) | Mudança localizada; demonstra parâmetros e voltar; usa `@react-navigation/native-stack`, já instalado | Duas camadas de navegação para explicar |
| B. Stack raiz envolvendo o drawer (detalhe abre por cima de tudo) | Uma pilha global | Mexe na estrutura toda; header do drawer some nas telas filhas de forma menos previsível |
| C. Modal dentro da própria tela | Sem dependência nova | Não é "navegação entre telas" nem passa parâmetro de rota — não cumpre o requisito |

**Escolhida: A** (*decisão do construtor*) — cumpre os dois requisitos de navegação com a menor alteração e com o padrão mais comum de React Navigation (drawer com stack aninhado).

## Design

### 1. Navegação do Cadastro
- `navigation/CadastroNavigator.tsx`: `createNativeStackNavigator<CadastroStackParamList>()` com:
  - `CadastroLista` — params `{ mensagem?: string }`
  - `CadastroDetalhe` — params `{ tipo: 'produto' | 'ingrediente', id: string, mensagem?: string }`
  - `CadastroFormulario` — params `{ tipo: 'produto' | 'ingrediente', id?: string }` (sem `id` = criar)
- Tipos das rotas em `navigation/tipos.ts`.
- No drawer, a rota `Cadastro` usa `headerShown: false`; o header passa a ser do stack. Na `CadastroLista`, o header tem `DrawerToggleButton` à esquerda para abrir o menu. Nas outras telas, a seta "voltar" padrão do stack; o voltar do Android também desempilha.
- `CadastroListaScreen`: alternância Produto/Ingrediente (mantida), botão "Novo …", lista com cards tocáveis (`Card onPress`) que navegam para `CadastroDetalhe` com `{ tipo, id }`. Recarrega a lista ao ganhar foco (`useFocusEffect`).
- `CadastroDetalheScreen`: lê `route.params`, busca `obterProduto`/`obterIngrediente`, exibe todos os campos (carregando / erro com "Tentar novamente" / 404 = "Item não encontrado"). Botões **Editar** (→ `CadastroFormulario { tipo, id }`) e **Excluir** (confirmação → `desativar…` → `popTo('CadastroLista', { mensagem })`). Recarrega ao ganhar foco.
- `CadastroFormularioScreen`: mesmo formulário para criar e editar; título do header muda ("Novo produto" / "Editar produto"). Em edição carrega o item pelo `id`. Ao salvar: criar → `popTo('CadastroLista', { mensagem })`; editar → `popTo('CadastroDetalhe', { tipo, id, mensagem })`.
- O `CadastroScreen.tsx` atual é dividido nesses três arquivos e removido.

### 2. Feedback de sucesso
- Novo componente `components/MensagemSucesso.tsx`, irmão visual do `MensagemErro` (cores `sucesso*` já existentes no tema), que some sozinho após ~4 s.
- Usado em: Perdas ("Perda registrada com sucesso!"), Produção, Correção de Estoque, Cadastro (lista e detalhe, recebendo a mensagem por parâmetro de rota).
- Cadastro: a mensagem recebida em `route.params.mensagem` é copiada para o estado e o parâmetro é limpo com `setParams`, para não reaparecer.

### 3. Validação
- Novo `utils/validacao.ts`:
  - `converterNumero(texto): number | null` — aceita vírgula, retorna `null` para vazio ou não-número.
  - `dataValida(texto): boolean` — formato `AAAA-MM-DD` e data real do calendário.
- Aplicado em Perdas, Produção, Estoque e no formulário do Cadastro, com mensagens específicas por campo (ex.: "Informe uma quantidade válida maior que zero.", "Data inválida. Use o formato AAAA-MM-DD."). Ingrediente: estoque máximo, se informado, não pode ser menor que o mínimo.

### 4. Sessão
- `services/api.ts` ganha `definirAoSessaoExpirar(callback)`; quando uma chamada **autenticada** (com `token`) recebe 401, o callback é chamado antes de lançar o erro.
- `AuthContext` registra o callback: limpa a sessão e define o erro "Sua sessão expirou. Faça login novamente.", que aparece na tela de Login. Só age se houver usuário logado (ref), para não interferir no fluxo de 2FA.
- `AuthContext` ganha `restaurando` (true até o AsyncStorage responder); `App.tsx` mostra o indicador de carregamento em vez do Login enquanto restaura.

### 5. Documentação
- README: seção **Checkpoint 03** (evolução desde o CP02, arquivos alterados, navegação atualizada com parâmetros, como executar o app, a WebAPI e o banco — resumo do README do backend com link — e como demonstrar via Expo Go / espelhamento).
- `TERMO_USO_IA.md`: data e itens dos Checkpoints 2 e 3.

## Deixado ao construtor
Textos exatos das mensagens, estilos finos, nomes internos de funções.
