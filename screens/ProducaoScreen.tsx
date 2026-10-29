import { useCallback, useEffect, useState } from 'react';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import Card from '../components/Card';
import MensagemErro from '../components/MensagemErro';
import MensagemSucesso from '../components/MensagemSucesso';
import Selecionador from '../components/Selecionador';
import TelaLista from '../components/TelaLista';
import TextoDetalhe from '../components/TextoDetalhe';
import TituloSecao from '../components/TituloSecao';
import { useAuth } from '../context/AuthContext';
import { ProducaoDiaria } from '../models/ProducaoDiaria';
import { Produto } from '../models/Produto';
import { listarProdutos } from '../services/produtosService';
import { listarProducao, registrarProducao } from '../services/producaoService';
import { converterNumero, dataLocalISO, dataValida } from '../utils/validacao';

export default function ProducaoScreen() {

    const { usuario } = useAuth();

    const[produtos, setProdutos] = useState<Produto[]>([]);
    const[producoes, setProducoes] = useState<ProducaoDiaria[]>([]);

    const[produtoId, setProdutoId] = useState('');
    const[data, setData] = useState(dataLocalISO());
    const[quantidadeProduzida, setQuantidadeProduzida] = useState('');
    const[observacoes, setObservacoes] = useState('');

    const[carregando, setCarregando] = useState(false);
    const[erro, setErro] = useState('');
    const[sucesso, setSucesso] = useState('');

    const[carregandoLista, setCarregandoLista] = useState(true);
    const[erroLista, setErroLista] = useState('');

    const carregarDados = useCallback(async () => {
        if (!usuario) return;

        setCarregandoLista(true);
        setErroLista('');

        try {
            const [listaProdutos, listaProducoes] = await Promise.all([
                listarProdutos(usuario.token),
                listarProducao(usuario.token),
            ]);
            setProdutos(listaProdutos);
            setProducoes(listaProducoes);
        } catch (e) {
            setErroLista(e instanceof Error ? e.message : 'Erro ao carregar dados.');
        } finally {
            setCarregandoLista(false);
        }
    }, [usuario]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    async function registrar() {
        if (!usuario) return;

        setSucesso('');

        const quantidadeNumero = converterNumero(quantidadeProduzida);

        if (produtoId === '') {
            setErro('Selecione um produto.');
            return;
        }

        if (!dataValida(data)) {
            setErro('Data inválida. Use o formato AAAA-MM-DD.');
            return;
        }

        if (quantidadeNumero === null || quantidadeNumero <= 0) {
            setErro('Informe uma quantidade válida maior que zero.');
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
            setData(dataLocalISO());
            setSucesso('Produção registrada com sucesso!');

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
            carregando={carregandoLista}
            erro={erroLista}
            aoRecarregar={carregarDados}
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
                    <MensagemSucesso mensagem={sucesso} />

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
