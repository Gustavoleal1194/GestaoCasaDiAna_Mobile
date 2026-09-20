import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type CampoTextoProps = TextInputProps & {
    label: string
}

export default function CampoTexto({ label, style, ...resto }: CampoTextoProps) {

    return (
        <View>
            <Text style={styles.label}>{ label }</Text>
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor={cores.textoPlaceholder}
                {...resto}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 11,
        fontFamily: fontes.corpoNegrito,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        color: cores.textoMuted,
        marginTop: 12,
        marginBottom: 6,
    },

    input: {
        width: '100%',
        backgroundColor: cores.superficieAlternativa,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        fontFamily: fontes.corpo,
        color: cores.textoTitulo,
    },
});
