import { useCallback, useEffect, useState } from 'react';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Card from '../components/Card';
import MensagemErro from '../components/MensagemErro';
import Selecionador from '../components/Selecionador';
import TelaLista from '../components/TelaLista';
import TextoDetalhe from '../components/TextoDetalhe';
import TituloSecao from '../components/TituloSecao';
import { useAuth } from '../context/AuthContext';
import { ProducaoDiaria } from '../models/ProducaoDiaria';
import { Produto } from '../models/Produto';
import { listarProdutos } from '../services/produtosService';
import { listarProducao, registrarProducao } from '../services/producaoService';

function hojeISO() {
    return new Date().toISOString().slice(0, 10);
}

export default function ProducaoScreen() {

    const { usuario } = useAuth();

    const[produtos, setProdutos] = useState<Produto[]>([]);
    const[producoes, setProducoes] = useState<ProducaoDiaria[]>([]);

    const[produtoId, setProdutoId] = useState('');
    const[data, setData] = useState(hojeISO());
    const[quantidadeProduzida, setQuantidadeProduzida] = useState('');
    const[observacoes, setObservacoes] = useState('');

    const[carregando, setCarregando] = useState(false);
    const[erro, setErro] = useState('');

    const carregarDados = useCallback(async () => {
        if (!usuario) return;

        try {
            const [listaProdutos, listaProducoes] = await Promise.all([
                listarProdutos(usuario.token),
                listarProducao(usuario.token),
            ]);
            setProdutos(listaProdutos);
            setProducoes(listaProducoes);
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao carregar dados.');
        }
    }, [usuario]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    async function registrar() {
        if (!usuario) return;

        const quantidadeNumero = Number(quantidadeProduzida.replace(',', '.'));

        if (produtoId === '' || !quantidadeProduzida || quantidadeNumero <= 0) {
            setErro('Produto e quantidade produzida são obrigatórios!');
            return;
        }

        setCarregando(true);
        setErro('');

        try {
            await registrarProducao({
                produtoId,
                data: `${data}T00:00:00`,
                quantidadeProduzida: quantidadeNumero,
                observacoes: observacoes.trim() === '' ? undefined : observacoes,
            }, usuario.token);

            setProdutoId('');
            setQuantidadeProduzida('');
            setObservacoes('');
            setData(hojeISO());

            await carregarDados();
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao registrar produção.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <TelaLista
            dados={producoes}
            chaveExtrator={(item) => item.id}
            mensagemVazia='Nenhuma produção registrada'
            cabecalho={
                <>
                    <TituloSecao>Registrar Produção Diária</TituloSecao>

                    <Selecionador
                        label='Produto'
                        itens={produtos.map((p) => ({ id: p.id, rotulo: p.nome }))}
                        valorSelecionado={produtoId}
                        onSelecionar={setProdutoId}
                    />

                    <CampoTexto
                        label='Data (AAAA-MM-DD)'
                        value={data}
                        onChangeText={setData}
                    />

                    <CampoTexto
                        label='Quantidade Produzida'
                        placeholder='Digite a quantidade'
                        keyboardType='numeric'
                        value={quantidadeProduzida}
                        onChangeText={setQuantidadeProduzida}
                    />

                    <CampoTexto
                        label='Observações (opcional)'
                        placeholder='Observações'
                        value={observacoes}
                        onChangeText={setObservacoes}
                    />

                    <MensagemErro mensagem={erro} />

                    <Botao
                        titulo={ carregando ? 'Registrando...' : 'Registrar' }
                        onPress={registrar}
                    />

                    <TituloSecao espacado>PRODUÇÃO REGISTRADA</TituloSecao>
                </>
            }
            renderItem={(item) => (
                <Card titulo={item.produtoNome}>
                    <TextoDetalhe>Data: { item.data.slice(0, 10) }</TextoDetalhe>
                    <TextoDetalhe>Quantidade: { item.quantidadeProduzida }</TextoDetalhe>
                    <TextoDetalhe>Custo total: R$ { item.custoTotal.toFixed(2) }</TextoDetalhe>
                    {
                        item.observacoes && (
                            <TextoDetalhe>Obs: { item.observacoes }</TextoDetalhe>
                        )
                    }
                </Card>
            )}
        />
    );
}
