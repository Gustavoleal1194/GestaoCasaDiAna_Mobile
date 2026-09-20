import { chamarApi } from './api';
import { ProducaoDiaria } from '../models/ProducaoDiaria';

export function listarProducao(token: string): Promise<ProducaoDiaria[]> {
    return chamarApi<ProducaoDiaria[]>('/producao-diaria', {}, token);
}

export function registrarProducao(
    dados: {
        produtoId: string,
        data: string,
        quantidadeProduzida: number,
        observacoes?: string
    },
    token: string
): Promise<ProducaoDiaria> {
    return chamarApi<ProducaoDiaria>('/producao-diaria', {
        method: 'POST',
        body: JSON.stringify(dados),
    }, token);
}
