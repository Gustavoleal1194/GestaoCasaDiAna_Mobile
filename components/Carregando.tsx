import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type CarregandoProps = {
    mensagem?: string
}

export default function Carregando({ mensagem = 'Carregando dados...' }: CarregandoProps) {

    return (
        <View style={styles.container}>
            <ActivityIndicator size='large' color={cores.destaque} />
            <Text style={styles.mensagem}>{ mensagem }</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },

    mensagem: {
        marginTop: 12,
        fontSize: 13,
        fontFamily: fontes.corpo,
        color: cores.textoCorpo,
    },
});
