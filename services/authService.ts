import { chamarApi } from './api';
import { LoginResultado, TokenResultado } from '../models/Usuario';

export function login(email: string, senha: string): Promise<LoginResultado> {
    return chamarApi<LoginResultado>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
    });
}

export function verificarOtp(tokenTemporario: string, codigo: string): Promise<TokenResultado> {
    return chamarApi<TokenResultado>('/auth/verificar-2fa', {
        method: 'POST',
        body: JSON.stringify({ codigo }),
    }, tokenTemporario);
}
