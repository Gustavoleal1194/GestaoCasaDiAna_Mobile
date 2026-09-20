import { StyleSheet, Text } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type TituloSecaoProps = {
    children: string,
    espacado?: boolean
}

export default function TituloSecao({ children, espacado }: TituloSecaoProps) {

    return (
        <Text style={[styles.titulo, espacado && styles.espacado]}>
            { children }
        </Text>
    );
}

const styles = StyleSheet.create({
    titulo: {
        fontSize: 20,
        fontFamily: fontes.titulo,
        color: cores.textoTitulo,
        marginBottom: 15,
        letterSpacing: -0.3,
    },

    espacado: {
        fontSize: 11,
        fontFamily: fontes.corpoNegrito,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: cores.textoMuted,
        marginTop: 30,
        marginBottom: 12,
    },
});
