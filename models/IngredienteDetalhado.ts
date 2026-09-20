export type IngredienteDetalhado = {
    id: string,
    nome: string,
    codigoInterno: string | null,
    categoriaId: string | null,
    categoriaNome: string | null,
    unidadeMedidaId: number,
    unidadeMedidaCodigo: string,
    estoqueAtual: number,
    estoqueMinimo: number,
    estoqueMaximo: number | null,
    estaBaixoDoMinimo: boolean,
    observacoes: string | null,
    ativo: boolean
}
