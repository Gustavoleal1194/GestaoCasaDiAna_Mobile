import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import Card from '../components/Card';
import MensagemSucesso from '../components/MensagemSucesso';
import TelaLista from '../components/TelaLista';
import TextoDetalhe from '../components/TextoDetalhe';
import TituloSecao from '../components/TituloSecao';
import { useAuth } from '../context/AuthContext';
import { Ingrediente } from '../models/Ingrediente';
import { Produto } from '../models/Produto';
import { CadastroStackParamList, TipoItem } from '../navigation/tipos';
import { listarIngredientes } from '../services/ingredientesService';
import { listarProdutos } from '../services/produtosService';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type CadastroListaProps = NativeStackScreenProps<CadastroStackParamList, 'CadastroLista'>;

export default function CadastroListaScreen({ navigation, route }: CadastroListaProps) {

    const { usuario } = useAuth();

    const[modo, setModo] = useState<TipoItem>('produto');

    const[produtos, setProdutos] = useState<Produto[]>([]);
    const[ingredientes, setIngredientes] = useState<Ingrediente[]>([]);

    const[carregandoLista, setCarregandoLista] = useState(true);
    const[erroLista, setErroLista] = useState('');
    const[sucesso, setSucesso] = useState('');

    const carregarDados = useCallback(async () => {
        if (!usuario) return;

        setCarregandoLista(true);
        setErroLista('');

        try {
            const [listaProdutos, listaIngredientes] = await Promise.all([
                listarProdutos(usuario.token),
                listarIngredientes(usuario.token),
            ]);
            setProdutos(listaProdutos);
            setIngredientes(listaIngredientes);
        } catch (e) {
            setErroLista(e instanceof Error ? e.message : 'Erro ao carregar dados.');
        } finally {
            setCarregandoLista(false);
        }
    }, [usuario]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    useEffect(() => {
        const mensagem = route.params?.mensagem;
        if (mensagem) {
            setSucesso(mensagem);
            navigation.setParams({ mensagem: undefined });
        }
    }, [route.params?.mensagem, navigation]);

    function abrirNovo() {
        setSucesso('');
        navigation.navigate('CadastroFormulario', { tipo: modo });
    }

    function abrirDetalhe(id: string) {
        setSucesso('');
        navigation.navigate('CadastroDetalhe', { tipo: modo, id });
    }

    return (
        <TelaLista<Produto | Ingrediente>
            dados={modo === 'produto' ? produtos : ingredientes}
            chaveExtrator={(item) => item.id}
            mensagemVazia={modo === 'produto' ? 'Nenhum produto cadastrado' : 'Nenhum ingrediente cadastrado'}
            carregando={carregandoLista}
            erro={erroLista}
            aoRecarregar={carregarDados}
            cabecalho={
                <>
                    <View style={styles.seletorModo}>
                        <Pressable
                            style={[styles.opcaoModo, modo === 'produto' && styles.opcaoModoAtiva]}
                            onPress={() => setModo('produto')}
                        >
                            <Text style={[styles.textoOpcaoModo, modo === 'produto' && styles.textoOpcaoModoAtiva]}>Produtos</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.opcaoModo, modo === 'ingrediente' && styles.opcaoModoAtiva]}
                            onPress={() => setModo('ingrediente')}
                        >
                            <Text style={[styles.textoOpcaoModo, modo === 'ingrediente' && styles.textoOpcaoModoAtiva]}>Ingredientes</Text>
                        </Pressable>
                    </View>

                    <Botao
                        titulo={ modo === 'produto' ? 'Novo produto' : 'Novo ingrediente' }
                        onPress={abrirNovo}
                    />

                    <MensagemSucesso mensagem={sucesso} />

                    <TituloSecao espacado>
                        { modo === 'produto' ? 'PRODUTOS CADASTRADOS' : 'INGREDIENTES CADASTRADOS' }
                    </TituloSecao>
                </>
            }
            renderItem={(item) => {
                if (modo === 'produto') {
                    const produto = item as Produto;
                    return (
                        <Card titulo={produto.nome} onPress={() => abrirDetalhe(produto.id)}>
                            <TextoDetalhe>Preço: R$ { produto.precoVenda.toFixed(2) }</TextoDetalhe>
                            {
                                produto.categoriaNome && (
                                    <TextoDetalhe>Categoria: { produto.categoriaNome }</TextoDetalhe>
                                )
                            }
                            <Text style={styles.dica}>Toque para ver detalhes</Text>
                        </Card>
                    );
                }

                const ingrediente = item as Ingrediente;
                return (
                    <Card
                        titulo={ingrediente.nome}
                        destaque={ingrediente.estaBaixoDoMinimo}
                        onPress={() => abrirDetalhe(ingrediente.id)}
                    >
                        <TextoDetalhe>
                            Estoque: { ingrediente.estoqueAtual } { ingrediente.unidadeMedidaCodigo }
                        </TextoDetalhe>
                        {
                            ingrediente.categoriaNome && (
                                <TextoDetalhe>Categoria: { ingrediente.categoriaNome }</TextoDetalhe>
                            )
                        }
                        <Text style={styles.dica}>Toque para ver detalhes</Text>
                    </Card>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    seletorModo: {
        flexDirection: 'row',
        backgroundColor: cores.superficieAlternativa,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 10,
        overflow: 'hidden',
        padding: 3,
        gap: 3,
    },

    opcaoModo: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },

    opcaoModoAtiva: {
        backgroundColor: cores.destaqueClaro,
    },

    textoOpcaoModo: {
        fontSize: 14,
        fontFamily: fontes.corpoNegrito,
        color: cores.textoMuted,
    },

    textoOpcaoModoAtiva: {
        color: cores.destaqueTexto,
    },

    dica: {
        marginTop: 8,
        fontSize: 12,
        fontFamily: fontes.corpoMedio,
        color: cores.destaqueTexto,
    },
});
