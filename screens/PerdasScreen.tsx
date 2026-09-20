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
import { Perda } from '../models/Perda';
import { Produto } from '../models/Produto';
import { listarProdutos } from '../services/produtosService';
import { listarPerdas, registrarPerda } from '../services/perdasService';

function hojeISO() {
    return new Date().toISOString().slice(0, 10);
}

export default function PerdasScreen() {

    const { usuario } = useAuth();

    const[produtos, setProdutos] = useState<Produto[]>([]);
    const[perdas, setPerdas] = useState<Perda[]>([]);

    const[produtoId, setProdutoId] = useState('');
    const[data, setData] = useState(hojeISO());
    const[quantidade, setQuantidade] = useState('');
    const[justificativa, setJustificativa] = useState('');

    const[carregando, setCarregando] = useState(false);
    const[erro, setErro] = useState('');

    const carregarDados = useCallback(async () => {
        if (!usuario) return;

        try {
            const [listaProdutos, listaPerdas] = await Promise.all([
                listarProdutos(usuario.token),
                listarPerdas(usuario.token),
            ]);
            setProdutos(listaProdutos);
            setPerdas(listaPerdas);
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao carregar dados.');
        }
    }, [usuario]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    async function registrar() {
        if (!usuario) return;

        const quantidadeNumero = Number(quantidade.replace(',', '.'));

        if (produtoId === '' || !quantidade || quantidadeNumero <= 0 || justificativa.trim() === '') {
            setErro('Produto, quantidade e justificativa são obrigatórios!');
            return;
        }

        setCarregando(true);
        setErro('');

        try {
            await registrarPerda({
                produtoId,
                data: `${data}T00:00:00`,
                quantidade: quantidadeNumero,
                justificativa,
            }, usuario.token);

            setProdutoId('');
            setQuantidade('');
            setJustificativa('');
            setData(hojeISO());

            await carregarDados();
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao registrar perda.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <TelaLista
            dados={perdas}
            chaveExtrator={(item) => item.id}
            mensagemVazia='Nenhuma perda registrada'
            cabecalho={
                <>
                    <TituloSecao>Registrar Perda</TituloSecao>

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
                        label='Quantidade'
                        placeholder='Digite a quantidade'
                        keyboardType='numeric'
                        value={quantidade}
                        onChangeText={setQuantidade}
                    />

                    <CampoTexto
                        label='Justificativa'
                        placeholder='Motivo da perda'
                        value={justificativa}
                        onChangeText={setJustificativa}
                    />

                    <MensagemErro mensagem={erro} />

                    <Botao
                        titulo={ carregando ? 'Registrando...' : 'Registrar' }
                        onPress={registrar}
                    />

                    <TituloSecao espacado>PERDAS REGISTRADAS</TituloSecao>
                </>
            }
            renderItem={(item) => (
                <Card titulo={item.produtoNome}>
                    <TextoDetalhe>Data: { item.data.slice(0, 10) }</TextoDetalhe>
                    <TextoDetalhe>Quantidade: { item.quantidade }</TextoDetalhe>
                    <TextoDetalhe>Justificativa: { item.justificativa }</TextoDetalhe>
                </Card>
            )}
        />
    );
}
