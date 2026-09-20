import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsuarioLogado } from '../models/Usuario';
import { login as loginService, verificarOtp as verificarOtpService } from '../services/authService';

const CHAVE_ARMAZENAMENTO = '@casadiana:usuario';

type AuthContextType = {
    usuario: UsuarioLogado | null,
    aguardando2Fa: boolean,
    carregando: boolean,
    erro: string,
    entrar: (email: string, senha: string) => Promise<void>,
    confirmarCodigo: (codigo: string) => Promise<void>,
    cancelar2Fa: () => void,
    sair: () => void
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
    const [tokenTemporario, setTokenTemporario] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        AsyncStorage.getItem(CHAVE_ARMAZENAMENTO).then((valor) => {
            if (valor) {
                setUsuario(JSON.parse(valor));
            }
        });
    }, []);

    async function salvarSessao(usuarioLogado: UsuarioLogado) {
        await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(usuarioLogado));
        setTokenTemporario(null);
        setUsuario(usuarioLogado);
    }

    async function entrar(email: string, senha: string) {
        setCarregando(true);
        setErro('');

        try {
            const resultado = await loginService(email, senha);

            if (resultado.requer2Fa) {
                setTokenTemporario(resultado.tokenTemporario!);
                return;
            }

            await salvarSessao({
                token: resultado.token!,
                nome: resultado.nome!,
                papel: resultado.papel!,
            });
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao entrar.');
        } finally {
            setCarregando(false);
        }
    }

    async function confirmarCodigo(codigo: string) {
        if (!tokenTemporario) return;

        setCarregando(true);
        setErro('');

        try {
            const resultado = await verificarOtpService(tokenTemporario, codigo);
            await salvarSessao(resultado);
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Código inválido.');
        } finally {
            setCarregando(false);
        }
    }

    function cancelar2Fa() {
        setTokenTemporario(null);
        setErro('');
    }

    function sair() {
        AsyncStorage.removeItem(CHAVE_ARMAZENAMENTO);
        setTokenTemporario(null);
        setUsuario(null);
    }

    return (
        <AuthContext.Provider value={{
            usuario,
            aguardando2Fa: tokenTemporario !== null,
            carregando,
            erro,
            entrar,
            confirmarCodigo,
            cancelar2Fa,
            sair,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return contexto;
}
