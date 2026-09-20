import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import BotaoAcao from '../components/BotaoAcao';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Card from '../components/Card';
import MensagemErro from '../components/MensagemErro';
import Selecionador from '../components/Selecionador';
import TelaLista from '../components/TelaLista';
import TextoDetalhe from '../components/TextoDetalhe';
import TituloSecao from '../components/TituloSecao';
import { useAuth } from '../context/AuthContext';
import { Categoria } from '../models/Categoria';
import { Ingrediente } from '../models/Ingrediente';
import { Produto } from '../models/Produto';
import { TipoProduto } from '../models/ProdutoDetalhado';
import { UnidadeMedida } from '../models/UnidadeMedida';
import { listarCategoriasIngrediente, listarCategoriasProduto } from '../services/categoriasService';
import {
    atualizarIngrediente,
    criarIngrediente,
    desativarIngrediente,
    listarIngredientes,
    obterIngrediente,
} from '../services/ingredientesService';
import {
    atualizarProduto,
    criarProduto,
    desativarProduto,
    listarProdutos,
    obterProduto,
} from '../services/produtosService';
import { listarUnidadesMedida } from '../services/unidadesMedidaService';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type Modo = 'produto' | 'ingrediente';

const TIPOS_PRODUTO = [
    { id: 'produzido', rotulo: 'Produzido' },
    { id: 'revenda', rotulo: 'Revenda' },
];

export default function CadastroScreen() {

    const { usuario } = useAuth();

    const[modo, setModo] = useState<Modo>('produto');
    const[idEmEdicao, setIdEmEdicao] = useState<string | null>(null);

    const[produtos, setProdutos] = useState<Produto[]>([]);
    const[ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const[categoriasProduto, setCategoriasProduto] = useState<Categoria[]>([]);
    const[categoriasIngrediente, setCategoriasIngrediente] = useState<Categoria[]>([]);
    const[unidadesMedida, setUnidadesMedida] = useState<UnidadeMedida[]>([]);

    const[nome, setNome] = useState('');
    const[precoVenda, setPrecoVenda] = useState('');
    const[categoriaProdutoId, setCategoriaProdutoId] = useState('');
    const[tipo, setTipo] = useState<TipoProduto>('produzido');
    const[descricao, setDescricao] = useState('');

    const[unidadeMedidaId, setUnidadeMedidaId] = useState('');
    const[estoqueMinimo, setEstoqueMinimo] = useState('');
    const[estoqueMaximo, setEstoqueMaximo] = useState('');
    const[codigoInterno, setCodigoInterno] = useState('');
    const[categoriaIngredienteId, setCategoriaIngredienteId] = useState('');
    const[observacoes, setObservacoes] = useState('');

    const[carregando, setCarregando] = useState(false);
    const[erro, setErro] = useState('');

    const carregarDados = useCallback(async () => {
        if (!usuario) return;

        try {
            const [listaProdutos, listaIngredientes, catsProduto, catsIngrediente, unidades] = await Promise.all([
                listarProdutos(usuario.token),
                listarIngredientes(usuario.token),
                listarCategoriasProduto(usuario.token),
                listarCategoriasIngrediente(usuario.token),
                listarUnidadesMedida(usuario.token),
            ]);
            setProdutos(listaProdutos);
            setIngredientes(listaIngredientes);
            setCategoriasProduto(catsProduto);
            setCategoriasIngrediente(catsIngrediente);
            setUnidadesMedida(unidades);
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao carregar dados.');
        }
    }, [usuario]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    function limparFormulario() {
        setIdEmEdicao(null);
        setNome('');
        setPrecoVenda('');
        setCategoriaProdutoId('');
        setTipo('produzido');
        setDescricao('');
        setUnidadeMedidaId('');
        setEstoqueMinimo('');
        setEstoqueMaximo('');
        setCodigoInterno('');
        setCategoriaIngredienteId('');
        setObservacoes('');
        setErro('');
    }

    function trocarModo(novoModo: Modo) {
        setModo(novoModo);
        limparFormulario();
    }

    async function editarProduto(id: string) {
        if (!usuario) return;

        try {
            const produto = await obterProduto(id, usuario.token);
            setIdEmEdicao(produto.id);
            setNome(produto.nome);
            setPrecoVenda(String(produto.precoVenda));
            setCategoriaProdutoId(produto.categoriaProdutoId ?? '');
            setTipo(produto.tipo);
            setDescricao(produto.descricao ?? '');
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao carregar produto.');
        }
    }

    async function editarIngrediente(id: string) {
        if (!usuario) return;

        try {
            const ingrediente = await obterIngrediente(id, usuario.token);
            setIdEmEdicao(ingrediente.id);
            setNome(ingrediente.nome);
            setUnidadeMedidaId(String(ingrediente.unidadeMedidaId));
            setEstoqueMinimo(String(ingrediente.estoqueMinimo));
            setEstoqueMaximo(ingrediente.estoqueMaximo != null ? String(ingrediente.estoqueMaximo) : '');
            setCodigoInterno(ingrediente.codigoInterno ?? '');
            setCategoriaIngredienteId(ingrediente.categoriaId ?? '');
            setObservacoes(ingrediente.observacoes ?? '');
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao carregar ingrediente.');
        }
    }

    function confirmarExclusao(nomeItem: string, excluir: () => void) {
        Alert.alert(
            'Excluir',
            `Deseja realmente desativar "${nomeItem}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: excluir },
            ]
        );
    }

    async function excluirProduto(produto: Produto) {
        if (!usuario) return;

        try {
            await desativarProduto(produto.id, usuario.token);
            if (idEmEdicao === produto.id) limparFormulario();
            await carregarDados();
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao excluir produto.');
        }
    }

    async function excluirIngrediente(ingrediente: Ingrediente) {
        if (!usuario) return;

        try {
            await desativarIngrediente(ingrediente.id, usuario.token);
            if (idEmEdicao === ingrediente.id) limparFormulario();
            await carregarDados();
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao excluir ingrediente.');
        }
    }

    async function salvarProduto() {
        if (!usuario) return;

        const precoNumero = Number(precoVenda.replace(',', '.'));

        if (nome.trim() === '' || !precoVenda || precoNumero <= 0) {
            setErro('Nome e preço de venda são obrigatórios!');
            return;
        }

        setCarregando(true);
        setErro('');

        const dados = {
            nome,
            precoVenda: precoNumero,
            categoriaProdutoId: categoriaProdutoId || null,
            descricao: descricao.trim() === '' ? null : descricao,
            tipo,
        };

        try {
            if (idEmEdicao) {
                await atualizarProduto(idEmEdicao, dados, usuario.token);
            } else {
                await criarProduto(dados, usuario.token);
            }
            limparFormulario();
            await carregarDados();
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao salvar produto.');
        } finally {
            setCarregando(false);
        }
    }

    async function salvarIngrediente() {
        if (!usuario) return;

        const unidadeNumero = Number(unidadeMedidaId);
        const estoqueMinimoNumero = Number(estoqueMinimo.replace(',', '.'));

        if (nome.trim() === '' || !unidadeMedidaId || !estoqueMinimo) {
            setErro('Nome, unidade de medida e estoque mínimo são obrigatórios!');
            return;
        }

        setCarregando(true);
        setErro('');

        const dados = {
            nome,
            unidadeMedidaId: unidadeNumero,
            estoqueMinimo: estoqueMinimoNumero,
            codigoInterno: codigoInterno.trim() === '' ? null : codigoInterno,
            categoriaId: categoriaIngredienteId || null,
            estoqueMaximo: estoqueMaximo.trim() === '' ? null : Number(estoqueMaximo.replace(',', '.')),
            observacoes: observacoes.trim() === '' ? null : observacoes,
        };

        try {
            if (idEmEdicao) {
                await atualizarIngrediente(idEmEdicao, dados, usuario.token);
            } else {
                await criarIngrediente(dados, usuario.token);
            }
            limparFormulario();
            await carregarDados();
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao salvar ingrediente.');
        } finally {
            setCarregando(false);
        }
    }

    const formularioProduto = (
        <View>
            <CampoTexto
                label='Nome'
                placeholder='Nome do produto'
                value={nome}
                onChangeText={setNome}
            />

            <CampoTexto
                label='Preço de Venda'
                placeholder='0,00'
                keyboardType='numeric'
                value={precoVenda}
                onChangeText={setPrecoVenda}
            />

            <Selecionador
                label='Categoria'
                itens={categoriasProduto.map((c) => ({ id: c.id, rotulo: c.nome }))}
                valorSelecionado={categoriaProdutoId}
                onSelecionar={setCategoriaProdutoId}
                placeholder='Sem categoria'
            />

            <Selecionador
                label='Tipo'
                itens={TIPOS_PRODUTO}
                valorSelecionado={tipo}
                onSelecionar={(id) => setTipo(id as TipoProduto)}
                placeholder='Selecione o tipo'
            />

            <CampoTexto
                label='Descrição (opcional)'
                placeholder='Descrição'
                value={descricao}
                onChangeText={setDescricao}
            />

            <MensagemErro mensagem={erro} />

            <Botao
                titulo={ carregando ? 'Salvando...' : (idEmEdicao ? 'Salvar Alterações' : 'Cadastrar Produto') }
                onPress={salvarProduto}
            />

            {
                idEmEdicao !== null && (
                    <Botao titulo='Cancelar Edição' variante='secundario' onPress={limparFormulario} />
                )
            }
        </View>
    );

    const formularioIngrediente = (
        <View>
            <CampoTexto
                label='Nome'
                placeholder='Nome do ingrediente'
                value={nome}
                onChangeText={setNome}
            />

            <Selecionador
                label='Unidade de Medida'
                itens={unidadesMedida.map((u) => ({ id: String(u.id), rotulo: `${u.codigo} — ${u.descricao}` }))}
                valorSelecionado={unidadeMedidaId}
                onSelecionar={setUnidadeMedidaId}
            />

            <CampoTexto
                label='Estoque Mínimo'
                placeholder='0'
                keyboardType='numeric'
                value={estoqueMinimo}
                onChangeText={setEstoqueMinimo}
            />

            <CampoTexto
                label='Estoque Máximo (opcional)'
                placeholder='0'
                keyboardType='numeric'
                value={estoqueMaximo}
                onChangeText={setEstoqueMaximo}
            />

            <CampoTexto
                label='Código Interno (opcional)'
                placeholder='Código'
                value={codigoInterno}
                onChangeText={setCodigoInterno}
            />

            <Selecionador
                label='Categoria'
                itens={categoriasIngrediente.map((c) => ({ id: c.id, rotulo: c.nome }))}
                valorSelecionado={categoriaIngredienteId}
                onSelecionar={setCategoriaIngredienteId}
                placeholder='Sem categoria'
            />

            <CampoTexto
                label='Observações (opcional)'
                placeholder='Observações'
                value={observacoes}
                onChangeText={setObservacoes}
            />

            <MensagemErro mensagem={erro} />

            <Botao
                titulo={ carregando ? 'Salvando...' : (idEmEdicao ? 'Salvar Alterações' : 'Cadastrar Ingrediente') }
                onPress={salvarIngrediente}
            />

            {
                idEmEdicao !== null && (
                    <Botao titulo='Cancelar Edição' variante='secundario' onPress={limparFormulario} />
                )
            }
        </View>
    );

    return (
        <TelaLista<Produto | Ingrediente>
            dados={modo === 'produto' ? produtos : ingredientes}
            chaveExtrator={(item) => item.id}
            mensagemVazia='Nada cadastrado ainda'
            cabecalho={
                <>
                    <TituloSecao>Cadastro</TituloSecao>

                    <View style={styles.seletorModo}>
                        <Pressable
                            style={[styles.opcaoModo, modo === 'produto' && styles.opcaoModoAtiva]}
                            onPress={() => trocarModo('produto')}
                        >
                            <Text style={[styles.textoOpcaoModo, modo === 'produto' && styles.textoOpcaoModoAtiva]}>Produto</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.opcaoModo, modo === 'ingrediente' && styles.opcaoModoAtiva]}
                            onPress={() => trocarModo('ingrediente')}
                        >
                            <Text style={[styles.textoOpcaoModo, modo === 'ingrediente' && styles.textoOpcaoModoAtiva]}>Ingrediente</Text>
                        </Pressable>
                    </View>

                    { modo === 'produto' ? formularioProduto : formularioIngrediente }

                    <TituloSecao espacado>
                        { modo === 'produto' ? 'PRODUTOS CADASTRADOS' : 'INGREDIENTES CADASTRADOS' }
                    </TituloSecao>
                </>
            }
            renderItem={(item) => {
                if (modo === 'produto') {
                    const produto = item as Produto;
                    return (
                        <Card titulo={produto.nome}>
                            <TextoDetalhe>Preço: R$ { produto.precoVenda.toFixed(2) }</TextoDetalhe>
                            {
                                produto.categoriaNome && (
                                    <TextoDetalhe>Categoria: { produto.categoriaNome }</TextoDetalhe>
                                )
                            }
                            <View style={styles.acoes}>
                                <BotaoAcao titulo='Editar' onPress={() => editarProduto(produto.id)} />
                                <BotaoAcao
                                    titulo='Excluir'
                                    perigo
                                    onPress={() => confirmarExclusao(produto.nome, () => excluirProduto(produto))}
                                />
                            </View>
                        </Card>
                    );
                }

                const ingrediente = item as Ingrediente;
                return (
                    <Card titulo={ingrediente.nome}>
                        <TextoDetalhe>
                            Estoque: { ingrediente.estoqueAtual } { ingrediente.unidadeMedidaCodigo }
                        </TextoDetalhe>
                        {
                            ingrediente.categoriaNome && (
                                <TextoDetalhe>Categoria: { ingrediente.categoriaNome }</TextoDetalhe>
                            )
                        }
                        <View style={styles.acoes}>
                            <BotaoAcao titulo='Editar' onPress={() => editarIngrediente(ingrediente.id)} />
                            <BotaoAcao
                                titulo='Excluir'
                                perigo
                                onPress={() => confirmarExclusao(ingrediente.nome, () => excluirIngrediente(ingrediente))}
                            />
                        </View>
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
        marginBottom: 15,
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

    acoes: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
});
