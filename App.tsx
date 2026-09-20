import {
    Sora_600SemiBold,
    Sora_700Bold,
    useFonts as useFontesSora,
} from '@expo-google-fonts/sora';
import {
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    useFonts as useFontesDMSans,
} from '@expo-google-fonts/dm-sans';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import LoginScreen from './screens/LoginScreen';
import { cores } from './theme/cores';

function Raiz() {
    const { usuario } = useAuth();

    return usuario ? <AppNavigator /> : <LoginScreen />;
}

export default function App() {

    const [fontesSoraProntas] = useFontesSora({ Sora_600SemiBold, Sora_700Bold });
    const [fontesDMSansProntas] = useFontesDMSans({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });

    if (!fontesSoraProntas || !fontesDMSansProntas) {
        return (
            <View style={styles.carregando}>
                <ActivityIndicator size='large' color={cores.destaque} />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.raiz}>
            <SafeAreaProvider>
                <AuthProvider>
                    <StatusBar style='light' />
                    <Raiz />
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    raiz: {
        flex: 1,
    },

    carregando: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: cores.fundo,
    },
});
