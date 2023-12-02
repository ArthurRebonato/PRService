import { StyleSheet, View, Text, Image } from 'react-native'
import React from 'react'

export default function RegistroTipos(props) {
    const data = props.dados

  return (
    <View style={styles.container}>
      <Image style={styles.imagem} source={{ uri: data.imageUrl }} />
      <Text style={styles.textDados}>{data.nome}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 1,
      borderRadius: 2,
      borderColor: "gray",
      margin: 5,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'black',
      flexDirection: "column",
      alignItems: 'center',
      width: 120,
    },
    textDados: {
      fontWeight: "bold",
      fontSize: 16,
      marginTop: 5,
    },
    imagem: {
      borderWidth: 1,
      borderColor: 'black',
      marginTop: -1,
      width: '103%', // Largura fixa para a imagem
      height: '70%', // Altura fixa para a imagem
    },
});
