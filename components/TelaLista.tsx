import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { cores } from '../theme/cores';
import ListaVazia from './ListaVazia';

type TelaListaProps<T> = {
    dados: T[],
    chaveExtrator: (item: T) => string,
    cabecalho: React.ReactElement,
    renderItem: (item: T) => React.ReactElement,
    mensagemVazia: string
}

export default function TelaLista<T>({
    dados,
    chaveExtrator,
    cabecalho,
    renderItem,
    mensagemVazia
}: TelaListaProps<T>) {

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
                ListHeaderComponent={cabecalho}
                renderItem={({ item }) => renderItem(item)}
                ListEmptyComponent={<ListaVazia mensagem={mensagemVazia} />}
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
