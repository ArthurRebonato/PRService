import React, { useState } from "react";
import { View, StyleSheet } from 'react-native'

import { Ionicons, MaterialIcons } from '@expo/vector-icons'

export default function Notification({ focused, color, size }) {
    const [contagem, setContagem] = useState(0);
    const [novaMensagem, setNovaMensagem] = useState(false);
    
    return (
        <View>
            {novaMensagem ? (
                <MaterialIcons name="notifications-active" color={color} size={size} />
            ) : (
                <Ionicons name="notifications" color={color} size={size} />
            )}
        </View>
    )
}