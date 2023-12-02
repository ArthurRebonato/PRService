import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';

import * as VagasService from "../../services/VagasService"
import * as CompanyService from '../../services/CompanyService'

import RegistroVagas from '../../components/RegistroVagas';

export default function AllVagasPage(props) {
  const route = useRoute();

  const { navigation } = props;

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const [vagas, setVagas] = useState([]);

  const buscarAllVagas = async(valor) => {
    try {
      let dados = await VagasService.getVagasByNome(valor);

      const vagasComEmails = await Promise.all(
        dados.map(async (vaga) => {
          try {
            let dadosCompany = await CompanyService.getCompanyByDocumentUID(vaga.uid);
            return { ...vaga, email: dadosCompany.email };
          } catch (error) {
            return vaga; 
          }
        })
      );

      setVagas(vagasComEmails);
    } catch (error) {
      
    }
  }

  useLayoutEffect(() => {
    const selecionado = route.params?.selecionado;
    setSelected(selecionado);

    buscarAllVagas(selecionado);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList data={vagas} style={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('DetalhesVaga', { dados: item.key, email: item.email, permission: false, vagas: vagas })}>
            <RegistroVagas dados={item} tipo={false} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.key}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>Não há nenhuma vaga para esta categoria!</Text>
          </View>
        )}
      />

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  linhaTexto: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
  },
  linha: {
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  Titulo: {
    fontFamily: 'serif',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  Input: {
    flex: 1,
    marginLeft: 15,
    color: '#000',
  },
  editIcon: {
    marginTop: 'auto',
    marginLeft: 10,
  },
  EsqueciSenha: {
    color: '#3498DB',
    fontFamily: 'serif',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  grayBlock: {
    height: 170,
    width: '90%',
    height: '40%',
    margin: 20,
    marginBottom: 5,
    marginTop: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ADADAD',
  },
  lista: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
  },
  emptyContainer: {
    width: '80%',
    marginTop: 10,
  },
});