import { chamarApi } from './api';
import { Categoria } from '../models/Categoria';

export function listarCategoriasIngrediente(token: string): Promise<Categoria[]> {
    return chamarApi<Categoria[]>('/categorias?apenasAtivos=true', {}, token);
}

export function listarCategoriasProduto(token: string): Promise<Categoria[]> {
    return chamarApi<Categoria[]>('/categorias-produto?apenasAtivos=true', {}, token);
}
