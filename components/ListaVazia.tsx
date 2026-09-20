import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type ListaVaziaProps = {
    mensagem: string,
    submensagem?: string
}

export default function ListaVazia({ mensagem, submensagem }: ListaVaziaProps) {

    return (
        <View style={styles.container}>
            <Text style={styles.mensagem}>{ mensagem }</Text>
            {
                submensagem && (
                    <Text style={styles.submensagem}>{ submensagem }</Text>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 14,
        padding: 32,
        alignItems: 'center',
    },

    mensagem: {
        fontSize: 15,
        fontFamily: fontes.corpoNegrito,
        color: cores.textoCorpo,
        marginBottom: 4,
    },

    submensagem: {
        fontSize: 13,
        fontFamily: fontes.corpo,
        color: cores.textoMuted,
    },
});
