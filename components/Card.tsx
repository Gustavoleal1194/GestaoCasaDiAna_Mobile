import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type CardProps = {
    titulo: string,
    destaque?: boolean,
    onPress?: () => void,
    children?: React.ReactNode
}

export default function Card({ titulo, destaque, onPress, children }: CardProps) {

    const conteudo = (
        <>
            <Text style={styles.titulo}>{ titulo }</Text>
            { children }
        </>
    );

    if (onPress) {
        return (
            <Pressable
                style={({ pressed }) => [
                    styles.card,
                    destaque && styles.cardDestaque,
                    pressed && styles.pressionado,
                ]}
                onPress={onPress}
            >
                { conteudo }
            </Pressable>
        );
    }

    return (
        <View style={[styles.card, destaque && styles.cardDestaque]}>
            { conteudo }
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
    },

    cardDestaque: {
        borderColor: cores.avisoBorda,
        backgroundColor: cores.avisoFundo,
    },

    pressionado: {
        opacity: 0.8,
    },

    titulo: {
        fontSize: 17,
        fontFamily: fontes.tituloSemiNegrito,
        color: cores.textoTitulo,
        marginBottom: 6,
    },
});
