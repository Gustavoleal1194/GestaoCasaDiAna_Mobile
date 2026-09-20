import { chamarApi } from './api';

export function corrigirEstoque(
    ingredienteId: string,
    novaQuantidade: number,
    observacao: string,
    token: string
): Promise<void> {
    return chamarApi<void>('/estoque/correcoes', {
        method: 'POST',
        body: JSON.stringify({
            itens: [
                { ingredienteId, novaQuantidade, observacao: observacao || null }
            ]
        }),
    }, token);
}
