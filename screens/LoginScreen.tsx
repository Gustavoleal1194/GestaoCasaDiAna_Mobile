import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import MensagemErro from '../components/MensagemErro';
import { useAuth } from '../context/AuthContext';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

export default function LoginScreen() {

    const { entrar, confirmarCodigo, cancelar2Fa, aguardando2Fa, carregando, erro } = useAuth();

    const[email, setEmail] = useState('');
    const[senha, setSenha] = useState('');
    const[codigo, setCodigo] = useState('');

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.conteudo}>
                <View style={styles.cabecalho}>
                    <Text style={styles.selo}>GESTÃO OPERACIONAL</Text>
                    <Text style={styles.tituloApp}>Casa di Ana</Text>
                    <View style={styles.linhaDestaque} />
                </View>

                <View style={styles.cartao}>
                    {
                        aguardando2Fa ? (
                            <View>
                                <Text style={styles.instrucao}>
                                    Digite o código de 6 dígitos do seu app autenticador.
                                </Text>
                                <CampoTexto
                                    label='Código de Verificação'
                                    placeholder='000000'
                                    keyboardType='number-pad'
                                    maxLength={6}
                                    value={codigo}
                                    onChangeText={setCodigo}
                                />

                                <MensagemErro mensagem={erro} />

                                {
                                    carregando ? (
                                        <ActivityIndicator style={styles.carregando} size='large' color={cores.destaque} />
                                    ) : (
                                        <View>
                                            <Botao
                                                titulo='Confirmar'
                                                onPress={() => confirmarCodigo(codigo)}
                                            />
                                            <Botao
                                                titulo='Voltar'
                                                variante='secundario'
                                                onPress={() => {
                                                    setCodigo('');
                                                    cancelar2Fa();
                                                }}
                                            />
                                        </View>
                                    )
                                }
                            </View>
                        ) : (
                            <View>
                                <CampoTexto
                                    label='E-mail'
                                    placeholder='Digite seu e-mail'
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    value={email}
                                    onChangeText={setEmail}
                                />

                                <CampoTexto
                                    label='Senha'
                                    placeholder='Digite sua senha'
                                    secureTextEntry
                                    value={senha}
                                    onChangeText={setSenha}
                                />

                                <MensagemErro mensagem={erro} />

                                {
                                    carregando ? (
                                        <ActivityIndicator style={styles.carregando} size='large' color={cores.destaque} />
                                    ) : (
                                        <Botao
                                            titulo='Entrar'
                                            onPress={() => entrar(email, senha)}
                                        />
                                    )
                                }
                            </View>
                        )
                    }
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: cores.fundo,
    },

    conteudo: {
        padding: 24,
    },

    cabecalho: {
        alignItems: 'center',
        marginBottom: 28,
    },

    selo: {
        fontFamily: fontes.corpoNegrito,
        fontSize: 11,
        letterSpacing: 2,
        color: cores.destaqueTexto,
        marginBottom: 6,
    },

    tituloApp: {
        fontFamily: fontes.titulo,
        fontSize: 28,
        color: cores.textoTitulo,
    },

    linhaDestaque: {
        width: 36,
        height: 3,
        borderRadius: 2,
        backgroundColor: cores.destaque,
        marginTop: 12,
    },

    cartao: {
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 16,
        padding: 20,
    },

    instrucao: {
        fontFamily: fontes.corpo,
        fontSize: 13,
        color: cores.textoCorpo,
        marginBottom: 6,
    },

    carregando: {
        marginTop: 20,
    },
});
