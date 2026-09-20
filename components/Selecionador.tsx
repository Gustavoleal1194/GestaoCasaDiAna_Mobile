import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type ItemSelecionador = {
    id: string,
    rotulo: string
}

type SelecionadorProps = {
    label: string,
    itens: ItemSelecionador[],
    valorSelecionado: string,
    onSelecionar: (id: string) => void,
    placeholder?: string
}

export default function Selecionador({
    label,
    itens,
    valorSelecionado,
    onSelecionar,
    placeholder = 'Selecione...'
}: SelecionadorProps) {

    return (
        <View>
            <Text style={styles.label}>{ label }</Text>
            <View style={styles.caixa}>
                <Picker
                    selectedValue={valorSelecionado}
                    onValueChange={(id) => onSelecionar(String(id))}
                    style={styles.picker}
                    dropdownIconColor={cores.textoMuted}
                    itemStyle={styles.itemPicker}
                >
                    <Picker.Item label={placeholder} value="" color={cores.textoPlaceholder} />
                    {
                        itens.map((item) => (
                            <Picker.Item key={item.id} label={item.rotulo} value={item.id} color={cores.textoTitulo} />
                        ))
                    }
                </Picker>
            </View>
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

    caixa: {
        backgroundColor: cores.superficieAlternativa,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 10,
        overflow: 'hidden',
    },

    picker: {
        color: cores.textoTitulo,
    },

    itemPicker: {
        color: cores.textoTitulo,
    },
});
