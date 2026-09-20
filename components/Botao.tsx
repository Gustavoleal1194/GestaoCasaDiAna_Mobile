import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

type BotaoProps = {
  titulo: string,
  onPress: () => void,
  variante?: 'primario' | 'secundario' | 'perigo'
}

export default function Botao({
  titulo,
  onPress,
  variante = 'primario'
}: BotaoProps) {

    if (variante === 'secundario') {
        return (
            <Pressable
                style={({ pressed }) => [styles.secundario, pressed && styles.pressionado]}
                onPress={ onPress }
            >
                <Text style={styles.textoSecundario}>{ titulo }</Text>
            </Pressable>
        );
    }

    const gradiente = variante === 'perigo'
        ? [cores.perigo, cores.perigoForte] as const
        : [cores.destaque, cores.destaqueForte] as const;

    return (
        <Pressable
            style={({ pressed }) => [styles.wrapper, pressed && styles.pressionado]}
            onPress={ onPress }
        >
            <LinearGradient
                colors={gradiente}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.botao}
            >
                <Text style={styles.texto}>{ titulo }</Text>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    marginTop: 10,
    shadowColor: cores.destaque,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },

  pressionado: {
    opacity: 0.85,
  },

  botao: {
     borderRadius: 12,
     paddingVertical: 14,
     alignItems: 'center',
   },

  texto: {
     fontSize: 15,
     fontFamily: fontes.tituloSemiNegrito,
     color: cores.branco,
   },

  secundario: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: cores.superficieAlternativa,
    borderWidth: 1,
    borderColor: cores.borda,
  },

  textoSecundario: {
    fontSize: 15,
    fontFamily: fontes.corpoNegrito,
    color: cores.textoCorpo,
  },
 });
