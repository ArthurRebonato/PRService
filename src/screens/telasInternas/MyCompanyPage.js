import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import RegistroMyCompanies from '../../components/RegistroMyCompanies';

import * as CompanyService from "../../services/CompanyService"

export default function MyCompanyPage(props) {
    const route = useRoute();

    const user = useSelector(store => store.user)

    const { navigation } = props;

    const [tipo, setTipo] = useState(0);

    const [myCompany, setMyCompany] = useState([])

    const buscarCompany = async() => {
        try {
            let dados = await CompanyService.getCompanyUid(user.uid)
            setMyCompany(dados)
        } catch (error) {
            
        }
    }

    useEffect(() => {
      const requestUser = async () => {
        try {
          const tipo = route.params?.tipo;
          setTipo(tipo);

          buscarCompany()
        } catch (error) {
          
        }
      };

      requestUser();
    }, [{ navigation }])


  return (
    <View style={styles.container}>
        {tipo ? (
          <FlatList data={myCompany} 
          renderItem={({ item }) => (
              <TouchableOpacity onPress={() => props.navigation.navigate('DetalhesCompany', { dados: item.key, permission: true, companies: myCompany })}>
                  <RegistroMyCompanies dados={item} />
              </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>Não há nenhuma empresa cadastrada!</Text>
            </View>
          )}
          />
        ) : (
          <FlatList data={myCompany} 
          renderItem={({ item }) => (
              <TouchableOpacity onPress={() => props.navigation.navigate('CompanyTalentPage', { dados: item.key })}>
                  <RegistroMyCompanies dados={item} />
              </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>Não há nenhuma empresa cadastrada!</Text>
            </View>
          )}
          />
        )}

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