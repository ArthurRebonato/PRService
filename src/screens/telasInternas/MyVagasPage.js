import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

import RegistroMyVagas from '../../components/RegistroMyVagas';

import * as VagasService from "../../services/VagasService"

export default function MyVagasPage(props) {
    const route = useRoute();

    const [keyDoc, setKeyDoc] = useState("");
    const [permissionUser, setPermissionUser] = useState("");

    const [emailCompany, setEmailCompany] = useState("");

    const { navigation } = props;

    const [myVagas, setMyVagas] = useState([])

    const buscarVagas = async() => {
        try {
            let dados = await VagasService.getVagasUid(keyDoc);
            setMyVagas(dados);
        } catch (error) {
            
        }
    }

    useEffect(() => {
      const requestUser = async () => {
        try {
            buscarVagas();
        } catch (error) {
          
        }
      };

      requestUser();
    }, [{ navigation }])

    useLayoutEffect(() => {
        const requestVagas = async () => {
          try {
            const keyDoc = route.params?.dados;
            setKeyDoc(keyDoc);

            const permissionUser = route.params?.permission;
            setPermissionUser(permissionUser);

            const email = route.params?.email;
            setEmailCompany(email);
          } catch (error) {

          }
        };

        requestVagas();
    }, []);

  return (
    <View style={styles.container}>
        <FlatList data={myVagas} 
          renderItem={({ item }) => (
              <TouchableOpacity onPress={() => props.navigation.navigate('DetalhesVaga', { dados: item.key, email:  emailCompany, permission: permissionUser, vagas: myVagas})}>
                  <RegistroMyVagas dados={item}/>
              </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>Não há nenhuma vaga cadastrada!</Text>
            </View>
          )}
        />

        <StatusBar style="light"/>
    </View >
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
});