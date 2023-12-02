import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';

import * as CompanyService from "../../services/CompanyService"

import RegistroMyCompanies from '../../components/RegistroMyCompanies';

export default function AllCompanyPage(props) {
    const { navigation } = props;

    const [myCompany, setMyCompany] = useState([])

    const buscarAllCompany = async() => {
        try {
            let dados = await CompanyService.getCompanyByPremium(true);
            setMyCompany(dados)
        } catch (error) {
            
        }
    }

    useLayoutEffect(() => {
      const requestUser = async () => {
        try {
          buscarAllCompany();
        } catch (error) {
          
        }
      };

      requestUser();
    }, [])


  return (
    <View style={styles.container}>
        <FlatList data={myCompany} 
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => props.navigation.navigate('DetalhesCompany', { dados: item.key, permission: false, companies: myCompany })}>
                <RegistroMyCompanies dados={item} />
            </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
            <Text>Não há nenhuma empresa Premium cadastrada!</Text>
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