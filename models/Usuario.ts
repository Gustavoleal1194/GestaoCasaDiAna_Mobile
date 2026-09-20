export type LoginResultado = {
    requer2Fa: boolean,
    tokenTemporario: string | null,
    token: string | null,
    nome: string | null,
    papel: string | null
}

export type UsuarioLogado = {
    token: string,
    nome: string,
    papel: string
}

export type TokenResultado = {
    token: string,
    nome: string,
    papel: string
}
