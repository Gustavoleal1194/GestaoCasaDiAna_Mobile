export type ProducaoDiaria = {
    id: string,
    produtoId: string,
    produtoNome: string,
    data: string,
    quantidadeProduzida: number,
    custoTotal: number,
    observacoes: string | null,
    criadoEm: string
}
