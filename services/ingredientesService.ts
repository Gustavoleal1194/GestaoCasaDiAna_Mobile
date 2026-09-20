import { chamarApi } from './api';
import { Ingrediente } from '../models/Ingrediente';
import { IngredienteDetalhado } from '../models/IngredienteDetalhado';

export type DadosIngrediente = {
    nome: string,
    unidadeMedidaId: number,
    estoqueMinimo: number,
    codigoInterno?: string | null,
    categoriaId?: string | null,
    estoqueMaximo?: number | null,
    observacoes?: string | null
}

export function listarIngredientes(token: string): Promise<Ingrediente[]> {
    return chamarApi<Ingrediente[]>('/ingredientes?apenasAtivos=true', {}, token);
}

export function obterIngrediente(id: string, token: string): Promise<IngredienteDetalhado> {
    return chamarApi<IngredienteDetalhado>(`/ingredientes/${id}`, {}, token);
}

export function criarIngrediente(dados: DadosIngrediente, token: string): Promise<IngredienteDetalhado> {
    return chamarApi<IngredienteDetalhado>('/ingredientes', {
        method: 'POST',
        body: JSON.stringify(dados),
    }, token);
}

export function atualizarIngrediente(id: string, dados: DadosIngrediente, token: string): Promise<IngredienteDetalhado> {
    return chamarApi<IngredienteDetalhado>(`/ingredientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
    }, token);
}

export function desativarIngrediente(id: string, token: string): Promise<void> {
    return chamarApi<void>(`/ingredientes/${id}`, {
        method: 'DELETE',
    }, token);
}
