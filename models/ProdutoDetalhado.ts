export type TipoProduto = 'produzido' | 'revenda';

export type ProdutoDetalhado = {
    id: string,
    nome: string,
    categoriaProdutoId: string | null,
    categoriaNome: string | null,
    descricao: string | null,
    precoVenda: number,
    ativo: boolean,
    tipo: TipoProduto,
    custoUnitario: number | null
}
