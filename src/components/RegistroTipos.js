import { StyleSheet, View, Text, Image } from 'react-native'
import React from 'react'

export default function RegistroTipos(props) {
    const data = props.dados

  return (
    <View style={styles.container}>
            <View style={styles.coluna}>
                <Image style={styles.imagem} source={{
                    uri: data.imageUrl,
                    }}
                />
                <Text style={styles.textDados}>{data.nome}</Text>
            </View>
    </View>
    )
}
    
const styles = StyleSheet.create({
    container: {
        padding: 1,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: "gray",
        margin: 5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
    }, coluna: {
        flex: 1,
        flexDirection: "column",
        width: 120,
        alignItems: 'center',
    }, textDados: {
        fontWeight: "bold",
        fontSize: 16,
        marginTop: 5,
    }, imagem: {
        borderWidth: 1,
        borderColor: 'black',
        marginTop: -1,
        width: '103%',
        height: '70%',
    }
})