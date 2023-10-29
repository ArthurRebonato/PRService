import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import { useSelector } from 'react-redux';

export default function NotificationPage(props) {

  const { navigation } = props;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.Titulo}>Tela das Notificações</Text>
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
  Titulo: {
    marginTop: 23,
    color: '#3498DB',
    fontFamily: 'serif',
    fontSize: 40,
    fontStyle: 'normal',
  },
});
