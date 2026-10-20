import { ApiResponse } from '../models/ApiResponse';

export const URL_BASE = 'https://casadiana-api.onrender.com/api';

const TEMPO_LIMITE_MS = 30000;

export async function chamarApi<T>(
    caminho: string,
    opcoes: RequestInit = {},
    token?: string | null
): Promise<T> {

    const controlador = new AbortController();
    const tempoLimite = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

    let resposta: Response;

    try {
        resposta = await fetch(`${URL_BASE}${caminho}`, {
            ...opcoes,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...opcoes.headers,
            },
            signal: controlador.signal,
        });
    } catch (erro) {
        if (erro instanceof Error && erro.name === 'AbortError') {
            throw new Error('A API demorou para responder. O servidor pode estar iniciando, tente novamente em instantes.');
        }
        throw new Error('Não foi possível conectar à API. Verifique sua conexão.');
    } finally {
        clearTimeout(tempoLimite);
    }

    if (resposta.status === 204) {
        return undefined as T;
    }

    let json: ApiResponse<T> | null = null;

    try {
        json = await resposta.json();
    } catch {
        json = null;
    }

    if (!resposta.ok || !json?.sucesso) {
        throw new Error(json?.erros?.join('\n') || mensagemPorStatus(resposta.status));
    }

    return json.dados as T;
}

function mensagemPorStatus(status: number): string {
    if (status === 401) return 'Sessão expirada ou credenciais inválidas. Faça login novamente.';
    if (status === 403) return 'Você não tem permissão para realizar esta ação.';
    if (status === 404) return 'Recurso não encontrado na API.';
    if (status === 502 || status === 503 || status === 504) {
        return 'Servidor indisponível no momento. Ele pode estar iniciando, tente novamente em instantes.';
    }
    if (status >= 500) return `Erro interno do servidor (${status}). Tente novamente mais tarde.`;
    if (status >= 400) return `Requisição inválida (${status}).`;
    return 'Resposta inválida recebida da API.';
}
