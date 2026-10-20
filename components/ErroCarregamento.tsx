import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';
import Botao from './Botao';

type ErroCarregamentoProps = {
    mensagem: string,
    aoTentarNovamente?: () => void
}

export default function ErroCarregamento({ mensagem, aoTentarNovamente }: ErroCarregamentoProps) {

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Não foi possível carregar os dados</Text>
            <Text style={styles.mensagem}>{ mensagem }</Text>
            {
                aoTentarNovamente && (
                    <Botao titulo='Tentar novamente' variante='secundario' onPress={aoTentarNovamente} />
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: cores.perigoFundo,
        borderWidth: 1,
        borderColor: cores.perigoBorda,
        borderRadius: 14,
        padding: 20,
        marginBottom: 12,
    },

    titulo: {
        fontSize: 15,
        fontFamily: fontes.corpoNegrito,
        color: cores.perigo,
        marginBottom: 4,
    },

    mensagem: {
        fontSize: 13,
        fontFamily: fontes.corpoMedio,
        color: cores.textoCorpo,
    },
});
