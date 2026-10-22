import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Carregando from '../components/Carregando';
import ErroCarregamento from '../components/ErroCarregamento';
import MensagemErro from '../components/MensagemErro';
import Selecionador from '../components/Selecionador';
import { useAuth } from '../context/AuthContext';
import { Categoria } from '../models/Categoria';
import { TipoProduto } from '../models/ProdutoDetalhado';
import { UnidadeMedida } from '../models/UnidadeMedida';
import { CadastroStackParamList } from '../navigation/tipos';
import { listarCategoriasIngrediente, listarCategoriasProduto } from '../services/categoriasService';
import { atualizarIngrediente, criarIngrediente, obterIngrediente } from '../services/ingredientesService';
import { atualizarProduto, criarProduto, obterProduto } from '../services/produtosService';
import { listarUnidadesMedida } from '../services/unidadesMedidaService';
import { cores } from '../theme/cores';
import { converterNumero } from '../utils/validacao';

type CadastroFormularioProps = NativeStackScreenProps<CadastroStackParamList, 'CadastroFormulario'>;

const TIPOS_PRODUTO = [
    { id: 'produzido', rotulo: 'Produzido' },
    { id: 'revenda', rotulo: 'Revenda' },
];

export default function CadastroFormularioScreen({ navigation, route }: CadastroFormularioProps) {

    const { tipo, id } = route.params;
    const { usuario } = useAuth();

    const[categorias, setCategorias] = useState<Categoria[]>([]);
    const[unidadesMedida, setUnidadesMedida] = useState<UnidadeMedida[]>([]);

    const[nome, setNome] = useState('');
    const[precoVenda, setPrecoVenda] = useState('');
    const[categoriaId, setCategoriaId] = useState('');
    const[tipoProduto, setTipoProduto] = useState<TipoProduto>('produzido');
    const[descricao, setDescricao] = useState('');

    const[unidadeMedidaId, setUnidadeMedidaId] = useState('');
    const[estoqueMinimo, setEstoqueMinimo] = useState('');
    const[estoqueMaximo, setEstoqueMaximo] = useState('');
    const[codigoInterno, setCodigoInterno] = useState('');
    const[observacoes, setObservacoes] = useState('');

    const[carregandoDados, setCarregandoDados] = useState(true);
    const[erroDados, setErroDados] = useState('');
    const[salvando, setSalvando] = useState(false);
    const[erro, setErro] = useState('');

    const carregarDados = useCallback(async () => {
        if (!usuario) return;

        setCarregandoDados(true);
        setErroDados('');

        try {
            if (tipo === 'produto') {
                const [cats, produto] = await Promise.all([
                    listarCategoriasProduto(usuario.token),
                    id ? obterProduto(id, usuario.token) : Promise.resolve(null),
                ]);
                setCategorias(cats);
                if (produto) {
                    setNome(produto.nome);
                    setPrecoVenda(String(produto.precoVenda));
                    setCategoriaId(produto.categoriaProdutoId ?? '');
                    setTipoProduto(produto.tipo);
                    setDescricao(produto.descricao ?? '');
                }
            } else {
                const [cats, unidades, ingrediente] = await Promise.all([
                    listarCategoriasIngrediente(usuario.token),
                    listarUnidadesMedida(usuario.token),
                    id ? obterIngrediente(id, usuario.token) : Promise.resolve(null),
                ]);
                setCategorias(cats);
                setUnidadesMedida(unidades);
                if (ingrediente) {
                    setNome(ingrediente.nome);
                    setUnidadeMedidaId(String(ingrediente.unidadeMedidaId));
                    setEstoqueMinimo(String(ingrediente.estoqueMinimo));
                    setEstoqueMaximo(ingrediente.estoqueMaximo != null ? String(ingrediente.estoqueMaximo) : '');
                    setCodigoInterno(ingrediente.codigoInterno ?? '');
                    setCategoriaId(ingrediente.categoriaId ?? '');
                    setObservacoes(ingrediente.observacoes ?? '');
                }
            }
        } catch (e) {
            setErroDados(e instanceof Error ? e.message : 'Erro ao carregar dados do formulário.');
        } finally {
            setCarregandoDados(false);
        }
    }, [usuario, tipo, id]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    function concluir(nomeSalvo: string) {
        if (id) {
            navigation.popTo('CadastroDetalhe', { tipo, id, mensagem: 'Alterações salvas com sucesso!' });
        } else {
            const rotulo = tipo === 'produto' ? 'Produto' : 'Ingrediente';
            navigation.popTo('CadastroLista', { mensagem: `${rotulo} "${nomeSalvo}" cadastrado com sucesso!` });
        }
    }

    async function salvarProduto() {
        if (!usuario) return;

        const precoNumero = converterNumero(precoVenda);

        if (nome.trim() === '') {
            setErro('Informe o nome.');
            return;
        }

        if (precoNumero === null || precoNumero <= 0) {
            setErro('Informe um preço de venda válido maior que zero.');
            return;
        }

        setSalvando(true);
        setErro('');

        const dados = {
            nome: nome.trim(),
            precoVenda: precoNumero,
            categoriaProdutoId: categoriaId || null,
            descricao: descricao.trim() === '' ? null : descricao,
            tipo: tipoProduto,
        };

        try {
            if (id) {
                await atualizarProduto(id, dados, usuario.token);
            } else {
                await criarProduto(dados, usuario.token);
            }
            concluir(dados.nome);
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao salvar produto.');
        } finally {
            setSalvando(false);
        }
    }

    async function salvarIngrediente() {
        if (!usuario) return;

        const estoqueMinimoNumero = converterNumero(estoqueMinimo);
        const estoqueMaximoNumero = estoqueMaximo.trim() === '' ? null : converterNumero(estoqueMaximo);

        if (nome.trim() === '') {
            setErro('Informe o nome.');
            return;
        }

        if (unidadeMedidaId === '') {
            setErro('Selecione a unidade de medida.');
            return;
        }

        if (estoqueMinimoNumero === null || estoqueMinimoNumero < 0) {
            setErro('Informe um estoque mínimo válido.');
            return;
        }

        if (estoqueMaximo.trim() !== '' && (estoqueMaximoNumero === null || estoqueMaximoNumero < estoqueMinimoNumero)) {
            setErro('O estoque máximo deve ser um número maior ou igual ao mínimo.');
            return;
        }

        setSalvando(true);
        setErro('');

        const dados = {
            nome: nome.trim(),
            unidadeMedidaId: Number(unidadeMedidaId),
            estoqueMinimo: estoqueMinimoNumero,
            codigoInterno: codigoInterno.trim() === '' ? null : codigoInterno,
            categoriaId: categoriaId || null,
            estoqueMaximo: estoqueMaximoNumero,
            observacoes: observacoes.trim() === '' ? null : observacoes,
        };

        try {
            if (id) {
                await atualizarIngrediente(id, dados, usuario.token);
            } else {
                await criarIngrediente(dados, usuario.token);
            }
            concluir(dados.nome);
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao salvar ingrediente.');
        } finally {
            setSalvando(false);
        }
    }

    if (carregandoDados) {
        return <Carregando />;
    }

    if (erroDados !== '') {
        return (
            <View style={styles.conteudo}>
                <ErroCarregamento mensagem={erroDados} aoTentarNovamente={carregarDados} />
                <Botao titulo='Voltar' variante='secundario' onPress={() => navigation.goBack()} />
            </View>
        );
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
                itens={categorias.map((c) => ({ id: c.id, rotulo: c.nome }))}
                valorSelecionado={categoriaId}
                onSelecionar={setCategoriaId}
                placeholder='Sem categoria'
            />

            <Selecionador
                label='Tipo'
                itens={TIPOS_PRODUTO}
                valorSelecionado={tipoProduto}
                onSelecionar={(valor) => setTipoProduto(valor as TipoProduto)}
                placeholder='Selecione o tipo'
            />

            <CampoTexto
                label='Descrição (opcional)'
                placeholder='Descrição'
                value={descricao}
                onChangeText={setDescricao}
            />
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
                itens={categorias.map((c) => ({ id: c.id, rotulo: c.nome }))}
                valorSelecionado={categoriaId}
                onSelecionar={setCategoriaId}
                placeholder='Sem categoria'
            />

            <CampoTexto
                label='Observações (opcional)'
                placeholder='Observações'
                value={observacoes}
                onChangeText={setObservacoes}
            />
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps='handled'>
                { tipo === 'produto' ? formularioProduto : formularioIngrediente }

                <MensagemErro mensagem={erro} />

                <Botao
                    titulo={ salvando ? 'Salvando...' : (id ? 'Salvar Alterações' : 'Cadastrar') }
                    onPress={salvando ? () => {} : (tipo === 'produto' ? salvarProduto : salvarIngrediente)}
                />
                <Botao titulo='Cancelar' variante='secundario' onPress={() => navigation.goBack()} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },

    conteudo: {
        padding: 20,
    },
});
