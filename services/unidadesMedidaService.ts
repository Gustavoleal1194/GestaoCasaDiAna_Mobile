import { chamarApi } from './api';
import { UnidadeMedida } from '../models/UnidadeMedida';

export function listarUnidadesMedida(token: string): Promise<UnidadeMedida[]> {
    return chamarApi<UnidadeMedida[]>('/unidades-medida', {}, token);
}
