import React from 'react'
import { View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeNavigationTabs from './BottomTabs'
import { FontAwesome, EvilIcons } from '@expo/vector-icons'

import Initial from '../screens/inicial/Initial';
import LoginUser from '../screens/inicial/LoginUser'
import CadastroUser from '../screens/inicial/CadastroUser'

import CompanyPage from '../screens/menuLateral/CompanyPage';
import Notification from '../screens/menuLateral/NotificationPage';

import EditarPerfilPage from '../screens/telasInternas/EditarPerfilPage'

import Configuration from '../components/Configuration'

const Stack = createNativeStackNavigator()

export default props => (
    <Stack.Navigator initialRouteName='Initial' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Initial" component={Initial} />
        <Stack.Screen name="LoginUser" component={LoginUser} />
        <Stack.Screen name="CadastroUser" component={CadastroUser} />
        <Stack.Screen name="EditarPerfilPage" component={EditarPerfilPage} options={{ headerShown: true, title: 'Editar Perfil', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="Home" component={HomeNavigationTabs} />
    </Stack.Navigator>
)

export function CompanyPageNavigation({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            headerTitleAlign: 'center',
            title: 'Página da Empresa',
            headerLeft: () => (
                <View style={{ margin: 10 }}>
                    <FontAwesome name="bars" size={20} color={"#000"} onPress={() => navigation.openDrawer()}/>
                </View>
            ),
            headerRight: () => (
                <View style={{ marginRight: 3, marginTop: 3 }}>
                    <Configuration navigation={navigation} />
                </View>
            )
        }}>
            <Stack.Screen name='CompanyPage' component={CompanyPage}/>
        </Stack.Navigator>
    )
}

export function NotificationNavigation({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            headerTitleAlign: 'center',
            title: 'Notificações',
            headerLeft: () => (
                <View style={{ margin: 10 }}>
                    <FontAwesome name="bars" size={20} color={"#000"} onPress={() => navigation.openDrawer()}/>
                </View>
            ),
            headerRight: () => (
                <View style={{ marginRight: 3, marginTop: 3 }}>
                    <Configuration navigation={navigation} />
                </View>
            )
        }}>
            <Stack.Screen name='Notification' component={Notification}/>
        </Stack.Navigator>
    )
}
