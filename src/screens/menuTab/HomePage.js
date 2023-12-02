import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Button } from '@rneui/themed';
import { useSelector } from 'react-redux';

import * as TipoServicoService from "../../services/TipoServicoService"
import * as TipoVagaService from "../../services/TipoVagaService"
import * as UserService from "../../services/UserService"

import RegistroTipos from '../../components/RegistroTipos';

export default function HomePage(props) {
  const user = useSelector(store => store.user)

  const { navigation } = props;

  const [tipoServico, setTipoServico] = useState([])
  const [tipoVaga, setTipoVaga] = useState([])

  const [userDados, setUserDados] = useState([])

  const nomeUsuario = userDados[0]?.nome || "";
  const nome = nomeUsuario.split(' ')[0];

  const buscarNomeUser = async() => {
    try {
        let dados = await UserService.getUserUid(user.uid)
        setUserDados(dados)
    } catch (error) {
        
    }
  }

  const buscarTipoServico = async() => {
      try {
        let dados = await TipoServicoService.getTipoServico()
        setTipoServico(dados)
      } catch (error) {
          
      }
  }

  const buscarTipoVaga = async() => {
    try {
      let dados = await TipoVagaService.getTipoVagas()
      setTipoVaga(dados)
    } catch (error) {
        
    }
}

  useLayoutEffect(() => {
    buscarNomeUser()
    buscarTipoServico()
    buscarTipoVaga()
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.TextContainer}>
        <Text style={styles.Titulo}>Olá, {nome}!</Text>
        <Text style={styles.Subtitulo}>O que você precisa?</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Serviços"
              buttonStyle={{
                  borderWidth: 2,
                  borderColor: '#3498DB',
                  borderRadius: 10,
              }}
              onPress={() => navigation.navigate('ServicosTab')}
          />
        </View>
        <View style={styles.button}>
          <Button title="Vagas"
              buttonStyle={{
                  borderWidth: 2,
                  borderColor: '#3498DB',
                  borderRadius: 10,
              }}
              onPress={() => navigation.navigate('VagasTab')}
          />
        </View>
      </View>
      <View style={styles.tipos}>
        <View style={[styles.grayBlock, {backgroundColor: '#9ff9a2'}]}>
          <Text style={styles.TextOptions}>Categorias Serviços:</Text>
          <FlatList data={tipoServico} horizontal showsHorizontalScrollIndicator={false} style={styles.lista}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {navigation.navigate('AllServicosPage', { selecionado: item.nome })}}>
                  <RegistroTipos dados={item} buscarTipoServico={buscarTipoServico}/>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.key}
          />
        </View>
        <View style={[styles.grayBlock, {backgroundColor: '#82D0FF'}]}>
          <Text style={styles.TextOptions}>Especialidade Vagas:</Text>
          <FlatList data={tipoVaga} horizontal showsHorizontalScrollIndicator={false} style={styles.lista}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {navigation.navigate('AllVagasPage', { selecionado: item.nome })}}>
                  <RegistroTipos dados={item} buscarTipoVaga={buscarTipoVaga}/>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.key}
          />
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  TextContainer: {
    marginLeft: 30,
    alignItems: 'flex-start',
  },
  Titulo: {
    marginTop: 22,
    fontFamily: 'serif',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  Subtitulo: {
    marginTop: 5,
    fontFamily: 'serif',
    fontSize: 24,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  button: {
    marginBottom: 10, 
    marginLeft: 35,
    width: 150,
  },
  tipos: {
    height: '100%',
  },
  grayBlock: {
    height: 170,
    width: '90%',
    height: '34%',
    margin: 20,
    marginBottom: 5,
    marginTop: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ADADAD',
  },
  TextOptions: {
    fontFamily: 'sans-serif',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 30,
    marginTop: 15,
  }, 
  lista: {
    marginTop: 3,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
  }
});
