import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'

import * as CompanyService from "../../services/CompanyService"
import * as VagasService from "../../services/VagasService"
import * as TipoVagaService from "../../services/TipoVagaService"

import RegistroCompany from '../../components/RegistroCompany';
import RegistroVagas from '../../components/RegistroVagas';

export default function ServicosPage(props) {
  const { navigation } = props;

  const [categoriaVisible, setCategoriaVisible] = useState(false);

  const [categorias, setCategorias] = useState([]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("Todos");

  const [companyPremium, setCompanyPremium] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [companies, setCompanies] = useState([]);

  const buscarCategorias = async() => {
    try {
      let dados = await TipoVagaService.getTipoVagas();

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

  const buscarCompanyPremium = async() => {
    try {
      let dados = await CompanyService.getTopPremiumCompanies();
      setCompanyPremium(dados);
    } catch (error) {
        
    }
  }

  const buscarCompanies = async() => {
    try {
      let dados = await CompanyService.getCompanies();
      setCompanies(dados);
    } catch (error) {
      
    }
  }

  const buscarVagas = async(valor) => {
    try {
        let vagas = await VagasService.getVagasByNome(valor);
        const uidsEmpresas = vagas.map(vaga => vaga.uid);

        let empresas = await Promise.all(uidsEmpresas.map(uid => CompanyService.getCompanyByDocumentUID(uid)));

        const empresasMap = empresas.reduce((acc, empresa) => {
          acc[empresa.key] = empresa;
          return acc;
        }, {});

        vagas = vagas.map(vaga => {
          const empresa = empresasMap[vaga.uid];
          if (empresa) {
            return { ...vaga, empresaEmail: empresa.email };
          }
          return vaga;
        });

        setVagas(vagas);
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
    buscarCompanyPremium();
    buscarCompanies();
  }, []);

  useEffect(() => {
    if (search == ""){
      buscarVagas(selected);
    } else {
      buscarVagas(search);
      setSelected("Todos");
    }
  }, [search, selected])

  return (
    <View style={styles.container}>
      <View style={[styles.linhaTexto, {justifyContent: 'space-between',}]}>
        <Text style={styles.Titulo}>Buscar</Text>
        <Button radius={"xl"} type="solid" color={'#47D013'} onPress={() => navigation.navigate('MapaVagasPage', {data: vagas, myVaga: {lat: -28.2652821, lng: -52.421083}})}>
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
      <TouchableOpacity style={{marginTop: 30, alignItems: 'center'}} onPress={() => {navigation.navigate('AllVagasPage', { selecionado: selected })}}>
        <Text style={styles.EsqueciSenha}>Todas as Vagas</Text>
      </TouchableOpacity>

      <View style={styles.tipos}>
        <View style={[styles.grayBlock, {backgroundColor: '#9ff9a2'}]}>
          <View style={[styles.linhaTexto, {justifyContent: 'space-between', marginTop: 5}]}>
            <Text style={[styles.Titulo, {fontSize: 26}]}>Empresas em Destaque</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <FlatList data={companyPremium} horizontal showsHorizontalScrollIndicator={false} style={styles.lista}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('DetalhesCompany', { dados: item.key, permission: false, companies: companies})}>
                    <RegistroCompany dados={item} tipo={"company"} initial={true}/>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.key}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text>Não há nenhuma empresa Premium!</Text>
                </View>
              )}
            />
            <TouchableOpacity style={{alignSelf: 'center', marginBottom: 50, marginRight: 5}} onPress={() => {navigation.navigate('AllCompanyPage')}}>
              <MaterialIcons name="arrow-forward-ios" size={34} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.grayBlock, {backgroundColor: '#82D0FF'}]}>
          <View style={[styles.linhaTexto, {justifyContent: 'space-between', marginTop: 5}]}>
            <Text style={styles.Titulo}>Vagas</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <FlatList data={vagas} horizontal showsHorizontalScrollIndicator={false} style={styles.lista}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('DetalhesVaga', { dados: item.key, email: item.empresaEmail, permission: false, vagas: vagas })}>
                    <RegistroVagas dados={item} tipo={"vagas"} initial={true}/>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.key}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text>Não há nenhuma vaga para esta categoria!</Text>
                </View>
              )}
            />
            <TouchableOpacity style={{alignSelf: 'center', marginBottom: 50, marginRight: 5}} onPress={() => {navigation.navigate('AllVagasPage', { selecionado: selected })}}>
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