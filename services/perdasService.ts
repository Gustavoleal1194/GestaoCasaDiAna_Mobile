import { chamarApi } from './api';
import { Perda } from '../models/Perda';

export function listarPerdas(token: string): Promise<Perda[]> {
    return chamarApi<Perda[]>('/perdas', {}, token);
}

export function registrarPerda(
    dados: {
        produtoId: string,
        data: string,
        quantidade: number,
        justificativa: string
    },
    token: string
): Promise<Perda> {
    return chamarApi<Perda>('/perdas', {
        method: 'POST',
        body: JSON.stringify(dados),
    }, token);
}
