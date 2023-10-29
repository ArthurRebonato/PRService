import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'

import { CompanyPageNavigation, NotificationNavigation } from './StackNavigation'
import Notification from '../components/Notification';

import StackNavigation from './StackNavigation';

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="HomeDrawer" component={StackNavigation} options={{
            drawerIcon: ({ color, size }) => <FontAwesome name="home" color={color} size={size} />,
            drawerLabel: 'Home',
            }}/>
            <Drawer.Screen name="CompanyPageDrawer" component={CompanyPageNavigation} options={{
            drawerIcon: ({ color, size }) => <MaterialIcons name="contact-page" color={color} size={size} />,
            drawerLabel: 'Página Empresa',
            }} />
            <Drawer.Screen name="NotificationDrawer" component={NotificationNavigation} options={{
            drawerIcon: ({ color, size }) => <Notification color={color} size={size} />,
            drawerLabel: 'Notificações',
            }} />
        </Drawer.Navigator>
    )
    
}
