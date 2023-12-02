import { StyleSheet, View, Text, Image } from 'react-native'
import React, { useState, useEffect } from 'react';

import { getImageFromFirebase } from '../services/ImagemService';

export default function RegistroMyVagas(props) {

    const data = props.dados
    const email = props.email

  return (
    <View style={styles.container}>
        <View>
            <View style={{marginTop: 10, marginLeft: 10, width: '95%', alignItems: 'center'}}>
                <Text style={styles.textTitulo}>{data.nome}</Text>
            </View>
            <View style={{ marginTop: 10, marginLeft: 15 }}>
                <View style={[styles.textContainer, {width: '95%'}]}>
                    <Text style={styles.textDados}>{data.modo}</Text>
                </View>
                <View style={[styles.textContainer, {width: '95%'}]}>
                    <Text style={styles.textDados}>{data.local}</Text>
                </View>
                <View style={[styles.textContainer, {width: '95%'}]}>
                    <Text style={styles.textDados}>{data.qtdvagas} vagas</Text>
                </View>
            </View>
        </View>
      <View style={{marginTop: 5, marginBottom: 10}}>
        <View style={styles.textContainer}>
            <Text style={[styles.textDados, {color: '#6fdfff'}]}>{data.candidaturas} candidaturas</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 20,
        marginTop: 10,
    }, 
    imageContainer: {
        marginRight: 20,
        alignItems: 'center',
        alignSelf: 'center',
    },
    imagem: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: "#000",
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 5,
    },
    textTitulo: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    textDados: {
        fontSize: 16,
        fontStyle: 'italic',
    },
})