import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Alert, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import * as VagasService from '../../services/VagasService'
import * as CurriculoVagaService from '../../services/CurriculoVagaService'
import { getImageFromFirebase } from '../../services/ImagemService';

export default function DetalhesVaga(props) {
  const route = useRoute();

  const user = useSelector(store => store.user)

  const { navigation } = props;

  const [keyDoc, setKeyDoc] = useState("");
  const [permissionUser, setPermissionUser] = useState("");

  const [Allvagas, setAllVagas] = useState([]);
  const [myVaga, setMyVaga] = useState({});

  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);

  const deleteVaga = async(vagaUid) => {
    try {
        setLoading(true);

        await VagasService.deleteVagaByDocumentID(vagaUid);

        setLoading(false);
        Alert.alert('Vaga deletada com sucesso!', '', 
        [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
        setLoading(false);
    }
  }

  const enviarCurriculo = async() => {
    try {
      const curriculoForm = {uidUser: `${user.uid}`, uidVaga: `${keyDoc}`, aprovado: false };
      const result = await CurriculoVagaService.createCurriculoVaga(curriculoForm);

      if (result == "Currículo enviado com sucesso!") {
        const vagaForm = {...myVaga, candidaturas: (myVaga.candidaturas + 1) };
        await VagasService.updateVaga(keyDoc, vagaForm);
      }

      Alert.alert(result);
    } catch (error) {
      Alert.alert("Erro ao enviar Currículo");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keyDoc = route.params?.dados;
        setKeyDoc(keyDoc);

        const permissionUser = route.params?.permission;
        setPermissionUser(permissionUser);

        const email = route.params?.email;

        const vagas = route.params?.vagas;
        setAllVagas(vagas);
  
        let dados = await VagasService.getVagasByDocumentUID(keyDoc);
        setMyVaga(dados);
  
        const imageUrl = await getImageFromFirebase(`${email}-perfilCompany`);
        setImage(imageUrl);
      } catch (error) {

      }
    };
  
    fetchData();
  }, [{ navigation }]);

  return (
    <View style={styles.container}>
      <View style={styles.PerfilImage}>
        <View style={styles.imageContainer}>
          {image != "" ? (
            <Image source={{uri: image}} style={styles.imagem}/>
          ) : (
            <Image source={require("../../../assets/userIcon.png")} style={styles.imagem}/>
          )}
        </View>
        {permissionUser ? (
          <TouchableOpacity style={styles.editIcon} onPress={() => {navigation.navigate('EditarVagaPage', { dados: myVaga })}}>
            <Feather name="edit" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
        {myVaga && myVaga.nome && (
            <Text style={[styles.Titulo, { fontSize: myVaga.nome.length > 10 ? 25 - Math.floor(myVaga.nome.length / 10) * 2 : 25 }]}>
                {myVaga.nome}
            </Text>
        )}
      <ScrollView style={styles.grayBlock}>
        <View style={[styles.linha, {marginTop: 13}]}>
          <Text style={styles.textoTitulo}>Local:</Text>
          <View style={[styles.card, {height: 70, alignItems: 'center'}]}>
              <Text style={styles.textoDescricao} numberOfLines={3}>
                {myVaga.local}
              </Text>
          </View>
          <Button radius={"xl"} type="solid" color={'#47D013'} containerStyle={{marginHorizontal: 5, marginVertical: 10}} onPress={() => navigation.navigate('MapaVagasPage', {data: Allvagas, myVaga: {lat: myVaga.lat, lng: myVaga.lng}})}>
            <FontAwesome5 name="map-marked-alt" size={24} color="white" />
          </Button>
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Modo:</Text>
          <Text style={[styles.textoUser, {width: 230}]}>{myVaga.modo}</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Experiência:</Text>
          <Text style={[styles.textoUser, {width: 230}]}>{myVaga.experiencia}</Text>
        </View>
        <View style={{marginLeft: 10, marginTop: 8,}}>
          <Text style={styles.textoTitulo}>Requisitos:</Text>
          <View style={[styles.card, {alignItems: 'center', marginTop: 10, width: '96%',}]}>
              <Text style={styles.textoDescricao} numberOfLines={3}>
                {myVaga.requisito}
              </Text>
          </View>
        </View>
        <View style={{marginLeft: 10, marginTop: 8,}}>
          <Text style={styles.textoTitulo}>Responsabilidades:</Text>
          <View style={[styles.card, {alignItems: 'center', marginTop: 10, width: '96%',}]}>
              <Text style={styles.textoDescricao} numberOfLines={3}>
                {myVaga.responsabilidade}
              </Text>
          </View>
        </View>
        <View style={[styles.linha, {justifyContent: 'space-between',}]}>
            <View style={{flexDirection: 'row', }}>
                <Text style={styles.textoTitulo}>Vagas:</Text>
                <Text style={styles.textoUser}>{myVaga.qtdvagas} </Text>
            </View>
            <View style={{flexDirection: 'row', marginRight: 20}}>
                <Text style={styles.textoTitulo}>Candidaturas:</Text>
                {permissionUser ? ( 
                  <TouchableOpacity onPress={() => {navigation.navigate('CandidaturasVagaPage', { dados: myVaga.key })}}>
                    <Text style={styles.EsqueciSenha}>{myVaga.candidaturas}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.textoUser}>{myVaga.candidaturas}</Text>
                )}
            </View>
        </View>
        <Modal transparent={true} animationType="none" visible={loading}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
                <ActivityIndicator size="large" color="#3498DB" />
            </View>
        </Modal>
        <View style={styles.buttonContainer}>
            {permissionUser ? (
                <Button title="Excluir Vaga" color="error" titleStyle={{ fontSize: 14 }} onPress={() => deleteVaga(keyDoc)}
                buttonStyle={{
                    borderWidth: 2,
                    borderColor: '#ff0000',
                    borderRadius: 30,
                }}
                />
            ) : (
                <Button title="Enviar Currículo" color="error" titleStyle={{ fontSize: 14 }} onPress={() => enviarCurriculo()}
                buttonStyle={{
                    borderWidth: 2,
                    borderColor: '#ff0000',
                    borderRadius: 30,
                }}
                />
            )}
        </View>
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  PerfilImage: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 15,
    marginBottom: 10,
  },
  imageContainer: {
    width: '60%',
    alignItems: 'center'
  },
  imagem: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  editIcon: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  Titulo: {
    fontFamily: 'serif',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  grayBlock: {
    width: '90%',
    height: '65%',
    backgroundColor: '#e6ecff',
    margin: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C2C2C2',
  },
  linha: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 8,
  },
  textoTitulo: {
    fontFamily: 'serif',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'bold',
    marginRight: 10,
  },
  textoUser: {
    fontFamily: 'serif',
    fontSize: 18,
    fontStyle: 'normal',
    fontStyle: 'italic',
  },
  textoDescricao: {
    fontFamily: 'serif',
    fontSize: 14,
    fontStyle: 'normal',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 5,
    width: '65%',
    height: 95,
  },
  EsqueciSenha: {
    color: '#3498DB',
    fontFamily: 'serif',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
});
