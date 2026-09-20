export type Ingrediente = {
    id: string,
    nome: string,
    codigoInterno: string | null,
    categoriaNome: string | null,
    unidadeMedidaCodigo: string,
    estoqueAtual: number,
    estoqueMinimo: number,
    estaBaixoDoMinimo: boolean,
    ativo: boolean
}
