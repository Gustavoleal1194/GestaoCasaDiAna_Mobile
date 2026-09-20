import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Card from '../components/Card';
import MensagemErro from '../components/MensagemErro';
import TelaLista from '../components/TelaLista';
import TextoDetalhe from '../components/TextoDetalhe';
import TituloSecao from '../components/TituloSecao';
import { useAuth } from '../context/AuthContext';
import { Ingrediente } from '../models/Ingrediente';
import { listarIngredientes } from '../services/ingredientesService';
import { corrigirEstoque } from '../services/estoqueService';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

export default function EstoqueScreen() {

    const { usuario } = useAuth();

    const[ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const[ingredienteSelecionado, setIngredienteSelecionado] = useState<Ingrediente | null>(null);

    const[novaQuantidade, setNovaQuantidade] = useState('');
    const[observacao, setObservacao] = useState('');

    const[carregando, setCarregando] = useState(false);
    const[erro, setErro] = useState('');

    const carregarIngredientes = useCallback(async () => {
        if (!usuario) return;

        try {
            const lista = await listarIngredientes(usuario.token);
            setIngredientes(lista);
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao carregar ingredientes.');
        }
    }, [usuario]);

    useEffect(() => {
        carregarIngredientes();
    }, [carregarIngredientes]);

    function selecionar(ingrediente: Ingrediente) {
        setIngredienteSelecionado(ingrediente);
        setNovaQuantidade(String(ingrediente.estoqueAtual));
        setObservacao('');
        setErro('');
    }

    function cancelar() {
        setIngredienteSelecionado(null);
        setNovaQuantidade('');
        setObservacao('');
        setErro('');
    }

    async function confirmarCorrecao() {
        if (!usuario || !ingredienteSelecionado) return;

        const quantidadeNumero = Number(novaQuantidade.replace(',', '.'));

        if (!novaQuantidade || quantidadeNumero < 0) {
            setErro('Informe a nova quantidade em estoque!');
            return;
        }

        setCarregando(true);
        setErro('');

        try {
            await corrigirEstoque(
                ingredienteSelecionado.id,
                quantidadeNumero,
                observacao,
                usuario.token
            );

            cancelar();
            await carregarIngredientes();
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao corrigir estoque.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <TelaLista
            dados={ingredientes}
            chaveExtrator={(item) => item.id}
            mensagemVazia='Nenhum ingrediente cadastrado'
            cabecalho={
                <>
                    <TituloSecao>Correção de Estoque</TituloSecao>

                    {
                        ingredienteSelecionado ? (
                            <View>
                                <Text style={styles.nomeSelecionado}>{ ingredienteSelecionado.nome }</Text>

                                <CampoTexto
                                    label={`Nova Quantidade (${ingredienteSelecionado.unidadeMedidaCodigo})`}
                                    keyboardType='numeric'
                                    value={novaQuantidade}
                                    onChangeText={setNovaQuantidade}
                                />

                                <CampoTexto
                                    label='Observação (opcional)'
                                    placeholder='Motivo do ajuste'
                                    value={observacao}
                                    onChangeText={setObservacao}
                                />

                                <MensagemErro mensagem={erro} />

                                <Botao
                                    titulo={ carregando ? 'Salvando...' : 'Confirmar Correção' }
                                    onPress={confirmarCorrecao}
                                />
                                <Botao
                                    titulo='Cancelar'
                                    variante='secundario'
                                    onPress={cancelar}
                                />
                            </View>
                        ) : (
                            <Text style={styles.instrucao}>
                                Toque em um ingrediente da lista abaixo para corrigir o estoque.
                            </Text>
                        )
                    }

                    <TituloSecao espacado>INGREDIENTES</TituloSecao>
                </>
            }
            renderItem={(item) => (
                <Card
                    titulo={item.nome}
                    destaque={item.estaBaixoDoMinimo}
                    onPress={() => selecionar(item)}
                >
                    <TextoDetalhe>
                        Estoque atual: { item.estoqueAtual } { item.unidadeMedidaCodigo }
                    </TextoDetalhe>
                    <TextoDetalhe>
                        Estoque mínimo: { item.estoqueMinimo } { item.unidadeMedidaCodigo }
                    </TextoDetalhe>
                    {
                        item.estaBaixoDoMinimo && (
                            <TextoDetalhe>Abaixo do mínimo</TextoDetalhe>
                        )
                    }
                </Card>
            )}
        />
    );
}

const styles = StyleSheet.create({
    nomeSelecionado: {
        fontFamily: fontes.tituloSemiNegrito,
        fontSize: 16,
        color: cores.textoTitulo,
        marginBottom: 4,
    },

    instrucao: {
        fontFamily: fontes.corpo,
        fontSize: 13,
        color: cores.textoCorpo,
    },
});
