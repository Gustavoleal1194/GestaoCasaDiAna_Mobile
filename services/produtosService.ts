import { chamarApi } from './api';
import { Produto } from '../models/Produto';
import { ProdutoDetalhado, TipoProduto } from '../models/ProdutoDetalhado';

export type DadosProduto = {
    nome: string,
    precoVenda: number,
    categoriaProdutoId?: string | null,
    descricao?: string | null,
    tipo?: TipoProduto
}

export function listarProdutos(token: string): Promise<Produto[]> {
    return chamarApi<Produto[]>('/produtos?apenasAtivos=true', {}, token);
}

export function obterProduto(id: string, token: string): Promise<ProdutoDetalhado> {
    return chamarApi<ProdutoDetalhado>(`/produtos/${id}`, {}, token);
}

export function criarProduto(dados: DadosProduto, token: string): Promise<ProdutoDetalhado> {
    return chamarApi<ProdutoDetalhado>('/produtos', {
        method: 'POST',
        body: JSON.stringify(dados),
    }, token);
}

export function atualizarProduto(id: string, dados: DadosProduto, token: string): Promise<ProdutoDetalhado> {
    return chamarApi<ProdutoDetalhado>(`/produtos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
    }, token);
}

export function desativarProduto(id: string, token: string): Promise<void> {
    return chamarApi<void>(`/produtos/${id}`, {
        method: 'DELETE',
    }, token);
}
