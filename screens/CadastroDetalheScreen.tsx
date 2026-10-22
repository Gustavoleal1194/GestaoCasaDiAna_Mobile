import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Botao from '../components/Botao';
import Card from '../components/Card';
import Carregando from '../components/Carregando';
import ErroCarregamento from '../components/ErroCarregamento';
import MensagemErro from '../components/MensagemErro';
import MensagemSucesso from '../components/MensagemSucesso';
import TextoDetalhe from '../components/TextoDetalhe';
import { useAuth } from '../context/AuthContext';
import { IngredienteDetalhado } from '../models/IngredienteDetalhado';
import { ProdutoDetalhado } from '../models/ProdutoDetalhado';
import { CadastroStackParamList } from '../navigation/tipos';
import { desativarIngrediente, obterIngrediente } from '../services/ingredientesService';
import { desativarProduto, obterProduto } from '../services/produtosService';
import { cores } from '../theme/cores';

type CadastroDetalheProps = NativeStackScreenProps<CadastroStackParamList, 'CadastroDetalhe'>;

function formatarMoeda(valor: number | null) {
    return valor != null ? `R$ ${valor.toFixed(2)}` : '—';
}

export default function CadastroDetalheScreen({ navigation, route }: CadastroDetalheProps) {

    const { tipo, id } = route.params;
    const { usuario } = useAuth();

    const[produto, setProduto] = useState<ProdutoDetalhado | null>(null);
    const[ingrediente, setIngrediente] = useState<IngredienteDetalhado | null>(null);

    const[carregando, setCarregando] = useState(true);
    const[erroCarregamento, setErroCarregamento] = useState('');
    const[excluindo, setExcluindo] = useState(false);
    const[erro, setErro] = useState('');
    const[sucesso, setSucesso] = useState('');

    const carregarItem = useCallback(async () => {
        if (!usuario) return;

        setCarregando(true);
        setErroCarregamento('');

        try {
            if (tipo === 'produto') {
                setProduto(await obterProduto(id, usuario.token));
            } else {
                setIngrediente(await obterIngrediente(id, usuario.token));
            }
        } catch (e) {
            setErroCarregamento(e instanceof Error ? e.message : 'Erro ao carregar o item.');
        } finally {
            setCarregando(false);
        }
    }, [usuario, tipo, id]);

    useFocusEffect(
        useCallback(() => {
            carregarItem();
        }, [carregarItem])
    );

    useEffect(() => {
        const mensagem = route.params.mensagem;
        if (mensagem) {
            setSucesso(mensagem);
            navigation.setParams({ mensagem: undefined });
        }
    }, [route.params.mensagem, navigation]);

    const item = tipo === 'produto' ? produto : ingrediente;
    const rotuloTipo = tipo === 'produto' ? 'Produto' : 'Ingrediente';

    function editar() {
        setSucesso('');
        navigation.navigate('CadastroFormulario', { tipo, id });
    }

    function confirmarExclusao() {
        if (!item) return;

        Alert.alert(
            'Excluir',
            `Deseja realmente desativar "${item.nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: excluir },
            ]
        );
    }

    async function excluir() {
        if (!usuario || !item) return;

        setExcluindo(true);
        setErro('');
        setSucesso('');

        try {
            if (tipo === 'produto') {
                await desativarProduto(id, usuario.token);
            } else {
                await desativarIngrediente(id, usuario.token);
            }
            navigation.popTo('CadastroLista', { mensagem: `${rotuloTipo} "${item.nome}" excluído com sucesso!` });
        } catch (e) {
            setErro(e instanceof Error ? e.message : `Erro ao excluir ${tipo}.`);
        } finally {
            setExcluindo(false);
        }
    }

    if (carregando && !item) {
        return <Carregando />;
    }

    if (!item) {
        return (
            <View style={styles.conteudo}>
                <ErroCarregamento
                    mensagem={erroCarregamento || `${rotuloTipo} não encontrado.`}
                    aoTentarNovamente={carregarItem}
                />
                <Botao titulo='Voltar' variante='secundario' onPress={() => navigation.goBack()} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.conteudo}>
            {
                erroCarregamento !== '' && (
                    <ErroCarregamento mensagem={erroCarregamento} aoTentarNovamente={carregarItem} />
                )
            }

            {
                produto && tipo === 'produto' && (
                    <Card titulo={produto.nome}>
                        <TextoDetalhe>Tipo: { produto.tipo === 'produzido' ? 'Produzido' : 'Revenda' }</TextoDetalhe>
                        <TextoDetalhe>Preço de venda: { formatarMoeda(produto.precoVenda) }</TextoDetalhe>
                        <TextoDetalhe>Custo unitário: { formatarMoeda(produto.custoUnitario) }</TextoDetalhe>
                        <TextoDetalhe>Categoria: { produto.categoriaNome ?? 'Sem categoria' }</TextoDetalhe>
                        <TextoDetalhe>Descrição: { produto.descricao ?? '—' }</TextoDetalhe>
                        <TextoDetalhe>Situação: { produto.ativo ? 'Ativo' : 'Inativo' }</TextoDetalhe>
                    </Card>
                )
            }

            {
                ingrediente && tipo === 'ingrediente' && (
                    <Card titulo={ingrediente.nome} destaque={ingrediente.estaBaixoDoMinimo}>
                        <TextoDetalhe>Código interno: { ingrediente.codigoInterno ?? '—' }</TextoDetalhe>
                        <TextoDetalhe>Categoria: { ingrediente.categoriaNome ?? 'Sem categoria' }</TextoDetalhe>
                        <TextoDetalhe>Unidade de medida: { ingrediente.unidadeMedidaCodigo }</TextoDetalhe>
                        <TextoDetalhe>
                            Estoque atual: { ingrediente.estoqueAtual } { ingrediente.unidadeMedidaCodigo }
                        </TextoDetalhe>
                        <TextoDetalhe>
                            Estoque mínimo: { ingrediente.estoqueMinimo } { ingrediente.unidadeMedidaCodigo }
                        </TextoDetalhe>
                        <TextoDetalhe>
                            Estoque máximo: { ingrediente.estoqueMaximo != null ? `${ingrediente.estoqueMaximo} ${ingrediente.unidadeMedidaCodigo}` : '—' }
                        </TextoDetalhe>
                        {
                            ingrediente.estaBaixoDoMinimo && (
                                <TextoDetalhe>Abaixo do estoque mínimo</TextoDetalhe>
                            )
                        }
                        <TextoDetalhe>Observações: { ingrediente.observacoes ?? '—' }</TextoDetalhe>
                    </Card>
                )
            }

            <MensagemSucesso mensagem={sucesso} />
            <MensagemErro mensagem={erro} />

            <Botao titulo='Editar' onPress={editar} />
            <Botao
                titulo={ excluindo ? 'Excluindo...' : 'Excluir' }
                variante='perigo'
                onPress={excluindo ? () => {} : confirmarExclusao}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteudo: {
        padding: 20,
        backgroundColor: cores.fundo,
    },
});
