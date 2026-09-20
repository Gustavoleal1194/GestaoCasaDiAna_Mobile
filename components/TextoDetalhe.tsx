import { StyleSheet, Text } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type TextoDetalheProps = {
    children: React.ReactNode
}

export default function TextoDetalhe({ children }: TextoDetalheProps) {

    return (
        <Text style={styles.detalhe}>{ children }</Text>
    );
}

const styles = StyleSheet.create({
    detalhe: {
        fontSize: 13,
        fontFamily: fontes.corpo,
        color: cores.textoCorpo,
        marginBottom: 2,
    },
});
