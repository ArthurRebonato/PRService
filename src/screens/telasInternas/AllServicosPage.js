import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';

import * as UserService from "../../services/UserService"

import RegistroServicos from '../../components/RegistroServicos';

export default function AllServicosPage(props) {
  const route = useRoute();

  const { navigation } = props;

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const [users, setUsers] = useState([]);

  const buscarAllUsers = async(valor) => {
    try {
        let dados = await UserService.getUsersByAtuacao(valor);
        setUsers(dados);
    } catch (error) {
        
    }
  }

  const buscarAllUsersTipo = async(tipo, valor) => {
    try {
        let dados = await UserService.getUsersBy(tipo, valor);
        setUsers(dados);
    } catch (error) {
        
    }
  }

  useLayoutEffect(() => {
    const selecionado = route.params?.selecionado;
    setSelected(selecionado);

    const tipo = route.params?.tipo;

    if (tipo === "premium") {
      buscarAllUsersTipo(true, selecionado);
    } else if (tipo === "freemium"){
      buscarAllUsersTipo(false, selecionado);
    } else {
      buscarAllUsers(selecionado);
    }
  }, []);

  return (
    <View style={styles.container}>
      <FlatList data={users.sort((a, b) => {
          if (a.premium === b.premium) {
            return b.rating - a.rating;
          }
          return a.premium ? -1 : 1;
        })}
        style={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => props.navigation.navigate('VisitPerfilPage', { key: item.key, curriculo: false, servicos: users })}>
            <RegistroServicos dados={item} tipo={false} curriculo={false}/>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.key}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>Não há nenhum serviço desta categoria!</Text>
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