export type TipoItem = 'produto' | 'ingrediente';

export type CadastroStackParamList = {
    CadastroLista: { mensagem?: string } | undefined,
    CadastroDetalhe: { tipo: TipoItem, id: string, mensagem?: string },
    CadastroFormulario: { tipo: TipoItem, id?: string },
};
