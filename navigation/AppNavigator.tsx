import {
    createDrawerNavigator,
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import CadastroScreen from '../screens/CadastroScreen';
import EstoqueScreen from '../screens/EstoqueScreen';
import PerdasScreen from '../screens/PerdasScreen';
import ProducaoScreen from '../screens/ProducaoScreen';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';

const Drawer = createDrawerNavigator();

function ConteudoMenu(props: DrawerContentComponentProps) {

    const { usuario, sair } = useAuth();

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.menu}>
            <View style={styles.cabecalhoMenu}>
                <Text style={styles.marca}>CASA DI ANA</Text>
                <View style={styles.linhaDestaque} />
                <Text style={styles.nomeUsuario}>{ usuario?.nome }</Text>
                <Text style={styles.papelUsuario}>{ usuario?.papel }</Text>
            </View>

            <DrawerItemList {...props} />

            <Pressable style={({ pressed }) => [styles.botaoSair, pressed && styles.botaoSairPressionado]} onPress={sair}>
                <Text style={styles.textoSair}>Sair</Text>
            </Pressable>
        </DrawerContentScrollView>
    );
}

export default function AppNavigator() {

    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <ConteudoMenu {...props} />}
                screenOptions={{
                    headerStyle: { backgroundColor: cores.superficie },
                    headerTintColor: cores.textoTitulo,
                    headerTitleStyle: { fontFamily: fontes.tituloSemiNegrito, fontSize: 17 },
                    sceneStyle: { backgroundColor: cores.fundo },
                    drawerStyle: { backgroundColor: cores.sidebarFundo, width: 260 },
                    drawerActiveBackgroundColor: cores.destaqueClaro,
                    drawerActiveTintColor: cores.destaqueTexto,
                    drawerInactiveTintColor: cores.sidebarTextoInativo,
                    drawerLabelStyle: { fontFamily: fontes.corpoMedio, fontSize: 14 },
                    drawerItemStyle: { borderRadius: 8 },
                }}
            >
                <Drawer.Screen
                    name='Perdas'
                    component={PerdasScreen}
                    options={{ title: 'Perdas' }}
                />
                <Drawer.Screen
                    name='Producao'
                    component={ProducaoScreen}
                    options={{ title: 'Produção Diária' }}
                />
                <Drawer.Screen
                    name='Estoque'
                    component={EstoqueScreen}
                    options={{ title: 'Correção de Estoque' }}
                />
                <Drawer.Screen
                    name='Cadastro'
                    component={CadastroScreen}
                    options={{ title: 'Cadastro' }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    menu: {
        flex: 1,
    },

    cabecalhoMenu: {
        padding: 20,
        paddingTop: 24,
        borderBottomWidth: 1,
        borderBottomColor: cores.sidebarDivisor,
        marginBottom: 10,
    },

    marca: {
        fontFamily: fontes.titulo,
        fontSize: 16,
        color: cores.sidebarTextoAtivo,
        letterSpacing: 0.5,
    },

    linhaDestaque: {
        width: 28,
        height: 2,
        borderRadius: 1,
        backgroundColor: cores.destaque,
        marginTop: 8,
        marginBottom: 14,
    },

    nomeUsuario: {
        fontFamily: fontes.corpoNegrito,
        fontSize: 15,
        color: cores.sidebarTextoAtivo,
    },

    papelUsuario: {
        fontFamily: fontes.corpo,
        fontSize: 12,
        color: cores.sidebarTextoInativo,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    botaoSair: {
        margin: 16,
        marginTop: 'auto',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        backgroundColor: 'rgba(248,113,113,0.10)',
        borderWidth: 1,
        borderColor: 'rgba(248,113,113,0.25)',
    },

    botaoSairPressionado: {
        opacity: 0.75,
    },

    textoSair: {
        fontFamily: fontes.corpoNegrito,
        fontSize: 14,
        color: cores.perigo,
    },
});
