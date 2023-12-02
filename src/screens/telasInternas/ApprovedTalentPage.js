import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

import * as CompanyTalentService from "../../services/CompanyTalentService"
import * as UserService from "../../services/UserService"

import RegistroServicos from '../../components/RegistroServicos';

export default function ApprovedTalentPage(props) {
    const route = useRoute();

    const { navigation } = props;

    const [keyDoc, setKeyDoc] = useState("");

    const [curriculosTalent, setCurriculosTalent] = useState([]);
    const [users, setUsers] = useState([]);

    const buscarCurriculos = async (key) => {
        try {
          const dadosCompanyTalent = await CompanyTalentService.getCompanyTalentByUidCompany(key, true);
      
          const curriculos = [];
      
          for (const item of dadosCompanyTalent) {
            const userUid = item.uidUser;
            const dadosUser = await UserService.getUserUid(userUid);

            const curriculoComUidCompany = { ...dadosUser[0], uidCompany: key };
            curriculos.push(curriculoComUidCompany);
          }

          setCurriculosTalent(curriculos);
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

        const users = route.params?.users;
        setUsers(users);
    }, []);

  return (
    <View style={styles.container}>
        <FlatList data={curriculosTalent} 
          renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('VisitPerfilPage', { key: item.key, curriculo: true, servicos: users })}>
                  <RegistroServicos dados={item} tipo={false} curriculo={true} aprovado={true} candidatura={"company"}/>
              </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>Não há nenhum curriculo aprovado!</Text>
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