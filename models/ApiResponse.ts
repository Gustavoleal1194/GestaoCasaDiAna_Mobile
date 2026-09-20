export type ApiResponse<T> = {
    sucesso: boolean,
    dados: T | null,
    erros: string[]
}
