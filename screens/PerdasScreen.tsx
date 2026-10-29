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
import { Perda } from '../models/Perda';
import { Produto } from '../models/Produto';
import { listarProdutos } from '../services/produtosService';
import { listarPerdas, registrarPerda } from '../services/perdasService';
import { converterNumero, dataLocalISO, dataValida } from '../utils/validacao';

export default function PerdasScreen() {

    const { usuario } = useAuth();

    const[produtos, setProdutos] = useState<Produto[]>([]);
    const[perdas, setPerdas] = useState<Perda[]>([]);

    const[produtoId, setProdutoId] = useState('');
    const[data, setData] = useState(dataLocalISO());
    const[quantidade, setQuantidade] = useState('');
    const[justificativa, setJustificativa] = useState('');

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
            const [listaProdutos, listaPerdas] = await Promise.all([
                listarProdutos(usuario.token),
                listarPerdas(usuario.token),
            ]);
            setProdutos(listaProdutos);
            setPerdas(listaPerdas);
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

        const quantidadeNumero = converterNumero(quantidade);

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

        if (justificativa.trim() === '') {
            setErro('Informe a justificativa da perda.');
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
            setData(dataLocalISO());
            setSucesso('Perda registrada com sucesso!');

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
            carregando={carregandoLista}
            erro={erroLista}
            aoRecarregar={carregarDados}
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
                    <MensagemSucesso mensagem={sucesso} />

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
