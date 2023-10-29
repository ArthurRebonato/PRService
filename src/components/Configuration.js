import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Modal, SafeAreaView, Alert, TouchableWithoutFeedback } from 'react-native'
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';

import * as loginService from "../services/LoginService"

export default function Configuration({ navigation }) {
    const [visible, setVisible] = useState(false)

    const logoff = async () => {
        try {
            await loginService.logoff()
            navigation.navigate("LoginUser");
        } catch (error) {
            Alert.alert(error)
        }
        setVisible(false);
    }

    const closePopup = () => {
        setVisible(false);
    }

    return (
        <>
            <TouchableOpacity onPress={() => setVisible(true)}>
                <EvilIcons name="gear" size={30} color={"#000"} />
            </TouchableOpacity>
            <Modal transparent visible={visible}>
                <SafeAreaView style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={closePopup}>
                        <View style={styles.overlay}></View>
                    </TouchableWithoutFeedback>
                    <View style={styles.popup}>
                        <View style={styles.option}>
                            <TouchableOpacity onPress={logoff}>
                                <View style={styles.optionContent}>
                                    <MaterialIcons name='logout' size={20} style={styles.optionItem}/>
                                    <Text style={styles.optionItem}>Logoff</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    popup: {
        borderRadius: 8,
        borderColor: '#333',
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        position: 'absolute',
        top: 45,
        right: 35,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionItem: {
        margin: 5,
        color: 'red',
    },
})
