import { Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type BotaoAcaoProps = {
    titulo: string,
    onPress: () => void,
    perigo?: boolean
}

export default function BotaoAcao({ titulo, onPress, perigo }: BotaoAcaoProps) {

    return (
        <Pressable
            style={({ pressed }) => [
                styles.botao,
                perigo && styles.botaoPerigo,
                pressed && styles.pressionado,
            ]}
            onPress={onPress}
        >
            <Text style={[styles.texto, perigo && styles.textoPerigo]}>{ titulo }</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    botao: {
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: cores.superficieAlternativa,
    },

    botaoPerigo: {
        borderColor: cores.perigoBorda,
        backgroundColor: cores.perigoFundo,
    },

    pressionado: {
        opacity: 0.7,
    },

    texto: {
        fontFamily: fontes.corpoNegrito,
        fontSize: 13,
        color: cores.textoCorpo,
    },

    textoPerigo: {
        color: cores.perigo,
    },
});
