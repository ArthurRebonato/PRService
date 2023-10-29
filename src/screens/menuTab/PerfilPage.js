import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons'

export default function PerfilPage(props) {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <View style={styles.PerfilImage}>
        <View style={styles.imageContainer}>
          <Image source={require("../../../assets/userIcon.png")} style={styles.imagem}/>
        </View>
        <TouchableOpacity style={styles.editIcon} onPress={() => {navigation.navigate('EditarPerfilPage');}}>
          <Feather name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.Titulo}>Nome do usuário</Text>
      <View style={styles.grayBlock}>
      </View>

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  PerfilImage: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 13,
  },
  imageContainer: {
    width: '75%',
    alignItems: 'center'
  },
  imagem: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  editIcon: {
    alignSelf: 'flex-end',
  },
  Titulo: {
    fontFamily: 'serif',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  grayBlock: {
    height: 170,
    width: '90%',
    height: '55%',
    backgroundColor: '#ccc',
    margin: 20,
    marginTop: 10,
    borderRadius: 20,
  },
});
