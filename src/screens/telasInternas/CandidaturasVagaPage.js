import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

import * as CurriculoVagaService from '../../services/CurriculoVagaService'
import * as UserService from "../../services/UserService"

import RegistroServicos from '../../components/RegistroServicos';

export default function CandidaturasVagaPage(props) {
    const route = useRoute();

    const { navigation } = props;

    const [keyDoc, setKeyDoc] = useState("");

    const [curriculosVaga, setCurriculosVaga] = useState([]);
    const [users, setUsers] = useState([]);

    const buscarUsers = async() => {
      const users = await UserService.getUsers();
      setUsers(users);
    }

    const buscarCurriculos = async (key) => {
        try {
          const dadosCurriculoVaga = await CurriculoVagaService.getCurriculoVagaByUidVaga(key, false);
      
          const curriculos = [];
      
          for (const item of dadosCurriculoVaga) {
            const userUid = item.uidUser;
            const dadosUser = await UserService.getUserUid(userUid);

            const curriculoComUidVaga = { ...dadosUser[0], uidVaga: key };
            curriculos.push(curriculoComUidVaga);
          }

          setCurriculosVaga(curriculos);
        } catch (error) {
          
        }
    }

    useEffect(() => {
        const requestCurriculos = async () => {
          try { 
            buscarCurriculos(keyDoc);
          } catch (error) {
            
          }
        };
  
        requestCurriculos();
    }, [{ navigation }])

    useLayoutEffect(() => {
        const key = route.params?.dados;
        setKeyDoc(key);

        buscarUsers();

        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('ApprovedVagaPage', { dados: key, users: users })}>
              <AntDesign name="addusergroup" size={24} color="black" />
            </TouchableOpacity>
          ),
        });
    }, [navigation]);

  return (
    <View style={styles.container}>
        <FlatList data={curriculosVaga} 
          renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('VisitPerfilPage', { key: item.key, curriculo: true, servicos: users })}>
                  <RegistroServicos dados={item} tipo={false} curriculo={true} candidatura={"vaga"}/>
              </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>Não há nenhum curriculo cadastrado!</Text>
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