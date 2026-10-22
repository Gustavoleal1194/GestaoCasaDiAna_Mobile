import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

const TEMPO_EXIBICAO_MS = 4000;

type MensagemSucessoProps = {
    mensagem: string
}

export default function MensagemSucesso({ mensagem }: MensagemSucessoProps) {

    const[visivel, setVisivel] = useState(false);

    useEffect(() => {
        if (mensagem === '') {
            setVisivel(false);
            return;
        }

        setVisivel(true);
        const temporizador = setTimeout(() => setVisivel(false), TEMPO_EXIBICAO_MS);
        return () => clearTimeout(temporizador);
    }, [mensagem]);

    if (mensagem === '' || !visivel) {
        return null;
    }

    return (
        <Text style={styles.sucesso}>{ mensagem }</Text>
    );
}

const styles = StyleSheet.create({
    sucesso: {
        marginTop: 12,
        padding: 12,
        borderRadius: 10,
        backgroundColor: cores.sucessoFundo,
        borderWidth: 1,
        borderColor: cores.sucessoBorda,
        color: cores.sucesso,
        fontFamily: fontes.corpoMedio,
        fontSize: 13,
    },
});
