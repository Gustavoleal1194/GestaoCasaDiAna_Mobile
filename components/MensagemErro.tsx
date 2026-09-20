import { StyleSheet, Text } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type MensagemErroProps = {
    mensagem: string
}

export default function MensagemErro({ mensagem }: MensagemErroProps) {

    if (mensagem === '') {
        return null;
    }

    return (
        <Text style={styles.erro}>{ mensagem }</Text>
    );
}

const styles = StyleSheet.create({
    erro: {
        marginTop: 12,
        padding: 12,
        borderRadius: 10,
        backgroundColor: cores.perigoFundo,
        borderWidth: 1,
        borderColor: cores.perigoBorda,
        color: cores.perigo,
        fontFamily: fontes.corpoMedio,
        fontSize: 13,
    },
});
