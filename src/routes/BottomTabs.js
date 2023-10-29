import React from 'react'
import { View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome, Entypo, EvilIcons } from '@expo/vector-icons'

import Home from '../screens/menuTab/HomePage'
import Perfil from '../screens/menuTab/PerfilPage'
import Servicos from '../screens/menuTab/ServicosPage'
import Vagas from '../screens/menuTab/VagasPage'
import Chat from '../screens/menuTab/ChatPage'

import ButtonChat from '../components/ButtonChat'
import Configuration from '../components/Configuration'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

export function HomeNavigation({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{
                headerShown: true,
                headerTitleAlign: 'center',
                title: 'Home',
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
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}

export function ServicosNavigation({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            headerTitleAlign: 'center',
            title: 'Serviços',
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
            <Stack.Screen name='Servicos' component={Servicos}/>
        </Stack.Navigator>
    )
}

export function VagasNavigation({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            headerTitleAlign: 'center',
            title: 'Vagas',
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
            <Stack.Screen name='Vagas' component={Vagas} />
        </Stack.Navigator>
    )
}

export function PerfilNavigation({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            headerTitleAlign: 'center',
            title: 'Perfil',
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
            <Stack.Screen name='Perfil' component={Perfil}/>
        </Stack.Navigator>
    )
}

export function ChatNavigation({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            headerTitleAlign: 'center',
            title: 'Chat',
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
            <Stack.Screen name='Chat' component={Chat}/>
        </Stack.Navigator>
    )
}

export default function HomeNavigationTabs() {
    return (
        <Tab.Navigator screenOptions={{
                headerShown: false,
                unmountOnBlur: true,
                tabBarStyle: { height: 70 },
                tabBarLabelStyle: {marginBottom: 10},
            }} >
            <Tab.Screen name='HomeTab' component={HomeNavigation} options={{
            tabBarIcon: ({ color, size }) => <FontAwesome name="home" color={color} size={size} />,
            tabBarLabel: 'Home',
            }}/>
            <Tab.Screen name="ServicosTab" component={ServicosNavigation} options={{
            tabBarIcon: ({ color, size }) => <Entypo name="slideshare" color={color} size={size} />,
            tabBarLabel: 'Serviços',
            }} />
            <Tab.Screen name="ChatTab" component={ChatNavigation} options={{
            tabBarIcon: ({ focused, size }) => <ButtonChat focused={focused} size={size} />,
            tabBarLabel: '',
            }} />
            <Tab.Screen name="VagasTab" component={VagasNavigation} options={{
            tabBarIcon: ({ color, size }) => <FontAwesome name="building" color={color} size={size} />,
            tabBarLabel: 'Vagas',
            }} />
            <Tab.Screen name="PerfilTab" component={PerfilNavigation} options={{
            tabBarIcon: ({ color, size }) => <FontAwesome name="user" color={color} size={size} />,
            tabBarLabel: 'Perfil',
            }} />
        </Tab.Navigator>
    );
}
