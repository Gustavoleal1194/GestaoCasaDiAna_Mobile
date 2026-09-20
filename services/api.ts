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

    const json: ApiResponse<T> = await resposta.json();

    if (!resposta.ok || !json.sucesso) {
        throw new Error(json.erros?.join('\n') || 'Erro ao comunicar com a API.');
    }

    return json.dados as T;
}
