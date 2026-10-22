import { DrawerToggleButton } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CadastroDetalheScreen from '../screens/CadastroDetalheScreen';
import CadastroFormularioScreen from '../screens/CadastroFormularioScreen';
import CadastroListaScreen from '../screens/CadastroListaScreen';
import { cores } from '../theme/cores';
import { fontes } from '../theme/fontes';
import { CadastroStackParamList } from './tipos';

const Stack = createNativeStackNavigator<CadastroStackParamList>();

export default function CadastroNavigator() {

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: cores.superficie },
                headerTintColor: cores.textoTitulo,
                headerTitleStyle: { fontFamily: fontes.tituloSemiNegrito, fontSize: 17 },
                contentStyle: { backgroundColor: cores.fundo },
            }}
        >
            <Stack.Screen
                name='CadastroLista'
                component={CadastroListaScreen}
                options={{
                    title: 'Cadastro',
                    headerLeft: () => <DrawerToggleButton tintColor={cores.textoTitulo} />,
                }}
            />
            <Stack.Screen
                name='CadastroDetalhe'
                component={CadastroDetalheScreen}
                options={{ title: 'Detalhes' }}
            />
            <Stack.Screen
                name='CadastroFormulario'
                component={CadastroFormularioScreen}
                options={({ route }) => {
                    const acao = route.params.id ? 'Editar' : 'Novo';
                    return { title: `${acao} ${route.params.tipo}` };
                }}
            />
        </Stack.Navigator>
    );
}
