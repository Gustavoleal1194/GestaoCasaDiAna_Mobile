import { FlatList, KeyboardAvoidingView, Platform, RefreshControl, StyleSheet } from 'react-native';
import { cores } from '../theme/cores';
import Carregando from './Carregando';
import ErroCarregamento from './ErroCarregamento';
import ListaVazia from './ListaVazia';

type TelaListaProps<T> = {
    dados: T[],
    chaveExtrator: (item: T) => string,
    cabecalho: React.ReactElement,
    renderItem: (item: T) => React.ReactElement,
    mensagemVazia: string,
    carregando?: boolean,
    erro?: string,
    aoRecarregar?: () => void
}

export default function TelaLista<T>({
    dados,
    chaveExtrator,
    cabecalho,
    renderItem,
    mensagemVazia,
    carregando = false,
    erro = '',
    aoRecarregar
}: TelaListaProps<T>) {

    const temDados = dados.length > 0;

    function estadoListaVazia() {
        if (carregando) {
            return <Carregando />;
        }

        if (erro !== '') {
            return <ErroCarregamento mensagem={erro} aoTentarNovamente={aoRecarregar} />;
        }

        return <ListaVazia mensagem={mensagemVazia} />;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FlatList
                data={dados}
                keyExtractor={chaveExtrator}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={styles.conteudo}
                ListHeaderComponent={
                    <>
                        { cabecalho }
                        {
                            temDados && erro !== '' && (
                                <ErroCarregamento mensagem={erro} aoTentarNovamente={aoRecarregar} />
                            )
                        }
                    </>
                }
                renderItem={({ item }) => renderItem(item)}
                ListEmptyComponent={estadoListaVazia()}
                refreshControl={
                    aoRecarregar && (
                        <RefreshControl
                            refreshing={carregando && temDados}
                            onRefresh={aoRecarregar}
                            tintColor={cores.destaque}
                            colors={[cores.destaque]}
                        />
                    )
                }
            />
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
        paddingTop: 20,
    },
});
