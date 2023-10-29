import React, { useState } from "react";
import { View, StyleSheet } from 'react-native'

import { Ionicons, MaterialIcons } from '@expo/vector-icons'

export default function ButtonChat({ focused, size }) {
    const [contagem, setContagem] = useState(0);
    const [novaMensagem, setNovaMensagem] = useState(false);
    
    return (
        <View style={[styles.container, { backgroundColor: focused ?  '#00a2ee' : '#6fdfff'}]}>
            {novaMensagem ? (
                <MaterialIcons name={"mark-chat-unread"} color={ focused ? '#FFF' : '#F8f8f8'} size={size} />
            ) : (
                <Ionicons name={"chatbubble-ellipses-sharp"} color={ focused ? '#FFF' : '#F8f8f8'} size={size} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3eccf5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
})