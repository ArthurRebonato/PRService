import React from 'react'
import { View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeNavigationTabs from './BottomTabs'
import { PerfilNavigation } from './BottomTabs'
import { FontAwesome, EvilIcons } from '@expo/vector-icons'

import Initial from '../screens/inicial/Initial';
import LoginUser from '../screens/inicial/LoginUser'
import CadastroUser from '../screens/inicial/CadastroUser'

import CompanyPage from '../screens/menuLateral/CompanyPage';
import Notification from '../screens/menuLateral/NotificationPage';

import EditarPerfilPage from '../screens/telasInternas/EditarPerfilPage'
import CreateCompanyPage from '../screens/telasInternas/CreateCompanyPage'
import MyCompanyPage from '../screens/telasInternas/MyCompanyPage'
import DetalhesCompany from '../screens/telasInternas/DetalhesCompany'
import EditarCompanyPage from '../screens/telasInternas/EditarCompanyPage'
import CreateVagaPage from '../screens/telasInternas/CreateVagaPage'
import MyVagasPage from '../screens/telasInternas/MyVagasPage'
import DetalhesVaga from '../screens/telasInternas/DetalhesVaga'
import EditarVagaPage from '../screens/telasInternas/EditarVagaPage'
import AllServicosPage from '../screens/telasInternas/AllServicosPage'
import VisitPerfilPage from '../screens/telasInternas/VisitPerfilPage'
import AllVagasPage from '../screens/telasInternas/AllVagasPage'
import AllCompanyPage from '../screens/telasInternas/AllCompanyPage'
import CompanyTalentPage from '../screens/telasInternas/CompanyTalentPage'
import ApprovedTalentPage from '../screens/telasInternas/ApprovedTalentPage'
import CandidaturasVagaPage from '../screens/telasInternas/CandidaturasVagaPage'
import ApprovedVagaPage from '../screens/telasInternas/ApprovedVagaPage'
import PrivateChatPage from '../screens/telasInternas/PrivateChatPage'
import MapaVagasPage from '../screens/telasInternas/MapaVagasPage'
import MapaCompaniesPage from '../screens/telasInternas/MapaCompaniesPage'
import MapaServicosPage from '../screens/telasInternas/MapaServicosPage'

import Configuration from '../components/Configuration'

const Stack = createNativeStackNavigator()

export default props => (
    <Stack.Navigator initialRouteName='Initial' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Initial" component={Initial} />
        <Stack.Screen name="LoginUser" component={LoginUser} />
        <Stack.Screen name="CadastroUser" component={CadastroUser} />
        <Stack.Screen name="EditarPerfilPage" component={EditarPerfilPage} options={{ headerShown: true, title: 'Editar Perfil', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="CreateCompanyPage" component={CreateCompanyPage} options={{ headerShown: true, title: 'Criar Nova Empresa', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="MyCompanyPage" component={MyCompanyPage} options={{ headerShown: true, title: 'Minhas Empresas', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="DetalhesCompany" component={DetalhesCompany} options={{ headerShown: true, title: 'Informações da Empresa', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="EditarCompanyPage" component={EditarCompanyPage} options={{ headerShown: true, title: 'Editar Empresa', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="CreateVagaPage" component={CreateVagaPage} options={{ headerShown: true, title: 'Criar Nova Vaga', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="MyVagasPage" component={MyVagasPage} options={{ headerShown: true, title: 'Vagas da Empresa', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="DetalhesVaga" component={DetalhesVaga} options={{ headerShown: true, title: 'Detalhes da Vaga', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="EditarVagaPage" component={EditarVagaPage} options={{ headerShown: true, title: 'Editar Vaga', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="AllServicosPage" component={AllServicosPage} options={{ headerShown: true, title: 'Todos os Serviços', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="VisitPerfilPage" component={VisitPerfilPage} options={{ headerShown: true, title: 'Perfil Usuário', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="AllVagasPage" component={AllVagasPage} options={{ headerShown: true, title: 'Todas as Vagas', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="AllCompanyPage" component={AllCompanyPage} options={{ headerShown: true, title: 'Todas Empresas Premium', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="CompanyTalentPage" component={CompanyTalentPage} options={{ headerShown: true, title: 'Curriculos - Empresa', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="ApprovedTalentPage" component={ApprovedTalentPage} options={{ headerShown: true, title: 'Curriculos Aprovado', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="CandidaturasVagaPage" component={CandidaturasVagaPage} options={{ headerShown: true, title: 'Curriculos - Vaga', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="ApprovedVagaPage" component={ApprovedVagaPage} options={{ headerShown: true, title: 'Curriculos Aprovado', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="PrivateChatPage" component={PrivateChatPage} options={{ headerShown: true, title: 'Chat Privado', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="MapaVagasPage" component={MapaVagasPage} options={{ headerShown: true, title: 'Mapa Vagas', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="MapaCompaniesPage" component={MapaCompaniesPage} options={{ headerShown: true, title: 'Mapa Empresas', headerTitleAlign: 'center',}}/>
        <Stack.Screen name="MapaServicosPage" component={MapaServicosPage} options={{ headerShown: true, title: 'Mapa Serviços', headerTitleAlign: 'center',}}/>
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
