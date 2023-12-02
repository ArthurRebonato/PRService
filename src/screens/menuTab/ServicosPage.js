import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'

import * as UserService from '../../services/UserService'
import * as TipoServicoService from '../../services/TipoServicoService'

import RegistroServicos from '../../components/RegistroServicos';

export default function ServicosPage(props) {
  const { navigation } = props;

  const [categoriaVisible, setCategoriaVisible] = useState(false);

  const [categorias, setCategorias] = useState([]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("Todos");

  const [userPremium, setUserPremium] = useState([]);
  const [userFreemium, setUserFreemium] = useState([]);
  const [users, setUsers] = useState([]);

  const buscarCategorias = async() => {
    try {
      let dados = await TipoServicoService.getTipoServico();

      const categoriasSimplificadas = [
        { key: "1", nome: "Todos" },
        ...dados.map(({ key, nome }) => ({ key, nome })),
      ];

      categoriasSimplificadas.sort((a, b) => {
        if (a.nome === "Todos") return -1;
        if (b.nome === "Todos") return 1;
        return a.nome.localeCompare(b.nome);
      });

      setCategorias(categoriasSimplificadas);
    } catch (error) {
      
    }
  }

  const buscarUsers = async(valor) => {
    try {
      let dadosPremium = await UserService.getTopUsers(true, valor);
      let dadosFreemium = await UserService.getTopUsers(false, valor);

      setUserPremium(dadosPremium);
      setUserFreemium(dadosFreemium);

      const combinedUsers = dadosPremium.concat(dadosFreemium);

      setUsers(combinedUsers);
    } catch (error) {
        
    }
  }

  const openCategory = () => {
    setCategoriaVisible(true);
  };

  const closeCategory = () => {
    setCategoriaVisible(false);
  };

  const handleCategorySelect = (category) => {
    setSelected(category);
    closeCategory();
  };

  useLayoutEffect(() => {
    buscarCategorias();
  }, []);

  useEffect(() => {
    if (search == ""){
      buscarUsers(selected);
    } else {
      buscarUsers(search);
      setSelected("Todos");
    }
  }, [search, selected])
  

  return (
    <View style={styles.container}>
      <View style={[styles.linhaTexto, {justifyContent: 'space-between',}]}>
        <Text style={styles.Titulo}>Buscar</Text>
        <Button radius={"xl"} type="solid" color={'#47D013'} onPress={() => navigation.navigate('MapaServicosPage', {data: users, myServico: {lat: -28.2652821, lng: -52.421083}})}>
          <FontAwesome5 name="map-marked-alt" size={24} color="white" />
        </Button>
      </View>
      <View style={[styles.linha, {justifyContent: 'space-between', height: 40, width: '80%',}]}>
        <Input placeholder="O que você precisa?" style={styles.Input}
        leftIcon={{ type: 'FontAwesome5', name: 'search' }}
        autoCapitalize="none"
        maxLength={35}
        value={search}
        onChangeText={(value) => setSearch(value)}
        />
        <TouchableOpacity style={styles.editIcon} onPress={openCategory}>
          <FontAwesome5 name="filter" size={24} color="black" />
        </TouchableOpacity>

        <Modal animationType="fade" transparent={true} visible={categoriaVisible} onRequestClose={closeCategory}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={closeCategory}>
            <View style={styles.modalContainer}>
              <FlatList data={categorias} style={{backgroundColor: '#fff'}}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.categoryItem, item.nome === selected ? {backgroundColor: '#00ffff'} : null]} 
                  onPress={() => handleCategorySelect(item.nome)}>
                    <Text>{item.nome}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.key.toString()}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <TouchableOpacity style={{marginTop: 30, alignItems: 'center'}} onPress={() => {navigation.navigate('AllServicosPage', { selecionado: selected })}}>
        <Text style={styles.EsqueciSenha}>Todos os Serviços</Text>
      </TouchableOpacity>

      <View style={styles.tipos}>
        <View style={[styles.grayBlock, {backgroundColor: '#9ff9a2'}]}>
          <View style={[styles.linhaTexto, {justifyContent: 'space-between', marginTop: 5}]}>
            <Text style={styles.Titulo}>Premium</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <FlatList data={userPremium.sort((a, b) => {
              if (a.premium === b.premium) {
                return b.rating - a.rating;
              }
              return a.premium ? -1 : 1;
              })} 
              horizontal showsHorizontalScrollIndicator={false} style={styles.lista}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('VisitPerfilPage', { key: item.key, curriculo: false, servicos: users })}>
                    <RegistroServicos dados={item} tipo={true} curriculo={false}/>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.key}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text>Não há nenhum serviço Premium desta categoria!</Text>
                </View>
              )}
            />
            <TouchableOpacity style={{alignSelf: 'center', marginBottom: 50, marginRight: 5}} onPress={() => {navigation.navigate('AllServicosPage', { selecionado: selected, tipo: "premium" })}}>
              <MaterialIcons name="arrow-forward-ios" size={34} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.grayBlock, {backgroundColor: '#82D0FF'}]}>
          <View style={[styles.linhaTexto, {justifyContent: 'space-between', marginTop: 5}]}>
            <Text style={styles.Titulo}>Freemium</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <FlatList data={userFreemium.sort((a, b) => b.rating - a.rating)}
              horizontal showsHorizontalScrollIndicator={false} style={styles.lista}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('VisitPerfilPage', { key: item.key, curriculo: false, servicos: users })}>
                    <RegistroServicos dados={item} tipo={true} curriculo={false}/>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.key}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text>Não há nenhum serviço desta categoria!</Text>
                </View>
              )}
            />
            <TouchableOpacity style={{alignSelf: 'center', marginBottom: 50, marginRight: 5}} onPress={() => {navigation.navigate('AllServicosPage', { selecionado: selected, tipo: "freemium" })}}>
              <MaterialIcons name="arrow-forward-ios" size={34} color="black" />
            </TouchableOpacity>
          </View>
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
  modalOverlay: {
    flex: 1,
  },
  modalContainer: {
    height: 270,
    alignItems: 'flex-end',
    marginTop: 180,
    marginRight: 40,
  },
  categoryItem: {
    padding: 16,
    width: 200,
    alignItems: 'center',
    borderWidth: 1,
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