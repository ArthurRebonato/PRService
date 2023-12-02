import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Alert, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { Button, AirbnbRating } from '@rneui/themed';
import { Feather, FontAwesome5, MaterialIcons, AntDesign } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import * as CompanyService from '../../services/CompanyService';
import * as VagasService from '../../services/VagasService'
import * as CompanyTalentService from '../../services/CompanyTalentService'
import { getImageFromFirebase, deleteImageFromFirebase } from '../../services/ImagemService';

export default function DetalhesCompany(props) {
  const route = useRoute();

  const user = useSelector(store => store.user)

  const { navigation } = props;

  const [keyDoc, setKeyDoc] = useState("");
  const [permissionUser, setPermissionUser] = useState("");

  const [allCompanies, setAllCompanies] = useState([]);
  const [myCompany, setMyCompany] = useState({});

  const [image, setImage] = useState("");

  const [rating, setRating] = useState(0);
  const [newRating, setNewRating] = useState(0);

  const [loading, setLoading] = useState(false);
  const [visibleAvaliacao, setVisibleAvaliacao] = useState(false);

  const confirmDelete = (companyUid) => {
    Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza de que deseja excluir?",
        [
          {
              text: "Cancelar",
              style: "cancel",
          },
          {
              text: "Confirmar",
              onPress: async () => { 
                try {
                  setLoading(true);
          
                  await CompanyService.deleteCompanyByUID(companyUid);
                  await VagasService.deleteVagasByCompanyUID(companyUid);
                  await deleteImageFromFirebase(myCompany.email);
          
                  setLoading(false);
                  Alert.alert('Empresa deletada com sucesso!', '', 
                  [{ text: 'OK', onPress: () => navigation.goBack() }]);
                } catch (error) {
                  setLoading(false);
                }
              },
              style: "destructive",
          },
        ],
        { cancelable: true }
    );
  };

  const updateRating = async(newRating) => {
    const updatedCompany = {};

    if (avaliacoes > 0){
      const mediaRating = ((userDados.rating + newRating) / 2);
      setRating(mediaRating);
      updatedCompany = {...myCompany, rating: mediaRating, avaliacoes: (myCompany.avaliacoes + 1)};
    } else {
      const mediaRating = (userDados.rating + newRating);
      setRating(mediaRating);
      updatedCompany = {...myCompany, rating: mediaRating, avaliacoes: (myCompany.avaliacoes + 1)};
    }
    
    setMyCompany(updatedCompany);

    await CompanyService.updateCompany(keyDoc, updatedCompany);
    setVisibleAvaliacao(false);
    Alert.alert('Avaliação realizada com sucesso!');
  };

  const enviarCurriculo = async() => {
    try {
      const curriculoForm = {uidUser: `${user.uid}`, uidCompany: `${keyDoc}`, aprovado: false };
      const result = await CompanyTalentService.createCompanyTalent(curriculoForm);
      Alert.alert(result);
    } catch (error) {
      Alert.alert("Erro ao enviar Currículo");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dados = await CompanyService.getCompanyByDocumentUID(keyDoc);
        setMyCompany(dados);
  
        const imageUrl = await getImageFromFirebase(`${dados.email}-perfilCompany`);
        setImage(imageUrl);
      } catch (error) {

      }
    };
  
    fetchData();
  }, [{ navigation }]);

  useLayoutEffect(() => {
    const key = route.params?.dados;
    setKeyDoc(key);

    const permissionUser = route.params?.permission;
    setPermissionUser(permissionUser);

    const companies = route.params?.companies;
    setAllCompanies(companies);

    if (permissionUser) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => confirmDelete(key)}>
            <AntDesign name="delete" size={20} color="red" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Modal transparent={true} animationType="none" visible={visibleAvaliacao}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 300, height: 300, backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: 'black', padding: 20, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'serif', fontSize: 20, fontStyle: 'normal', fontWeight: 'bold', marginBottom: 10 }}>
              Avaliação da Empresa
            </Text>
            <Text style={[styles.textoUser, { width: 230 }]}>Marque quantas estrelas essa Empresa merece:</Text>
            <AirbnbRating count={5} defaultRating={0} size={40} reviews={['Péssimo', 'Ruim', 'Médio', 'Bom', 'Ótimo']} showRating={true} onFinishRating={(newRating) => setNewRating(newRating)} />
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ flex: 1, marginHorizontal: 20 }}>
                <Button
                  title="Cancelar"
                  titleStyle={{ fontSize: 14 }}
                  onPress={() => setVisibleAvaliacao(false)}
                  buttonStyle={{
                    borderWidth: 2,
                    borderColor: '#3498DB',
                    borderRadius: 30,
                  }}
                />
              </View>
              <View style={{ flex: 1, marginHorizontal: 20 }}>
                <Button
                  title="Confirmar"
                  titleStyle={{ fontSize: 14 }}
                  onPress={() => updateRating(newRating)}
                  buttonStyle={{
                    borderWidth: 2,
                    borderColor: '#3498DB',
                    borderRadius: 30,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.rating}>
        <View style={styles.ratingStars}>
          <AirbnbRating count={5} defaultRating={myCompany.rating} size={20} showRating={false} isDisabled />
        </View>
        <View style={styles.avaliarButton}>
          <TouchableOpacity onPress={() => setVisibleAvaliacao(true)}>
            <Text style={styles.EsqueciSenha}>Avaliar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.PerfilImage}>
        <View style={styles.imageContainer}>
          {image != "" ? (
            <Image source={{uri: image}} style={myCompany.premium ? [styles.imagem, {marginLeft: 40}] : styles.imagem}/>
          ) : (
            <Image source={require("../../../assets/userIcon.png")} style={myCompany.premium ? [styles.imagem, {marginLeft: 40}] : styles.imagem}/>
          )}
        </View>
        {myCompany.premium ? (
          <MaterialIcons name="verified" size={30} color="#008BFF" />
        ) : (
          <></>
        )}
        {permissionUser ? (
          <TouchableOpacity style={styles.editIcon} onPress={() => {navigation.navigate('EditarCompanyPage', { dados: keyDoc })}}>
            <Feather name="edit" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      {myCompany && myCompany.nome && (
        <Text style={[styles.Titulo, { fontSize: myCompany.nome.length > 10 ? 25 - Math.floor(myCompany.nome.length / 10) * 2 : 25}]}>
          {myCompany.nome}
        </Text>
      )}
      
      <ScrollView style={styles.grayBlock}>
        <View style={[styles.linha, { marginTop: 15 }]}>
          <Text style={styles.textoTitulo}>Email:</Text>
          {myCompany && myCompany.email && (
            <Text style={myCompany.email.length > 25 ? [styles.textoUser, { fontSize: 16 }] : styles.textoUser}>
              {myCompany.email}
            </Text>
          )}
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Sede:</Text>
          <View style={[styles.card, {height: 70, alignItems: 'center'}]}>
              <Text style={styles.textoDescricao} numberOfLines={3}>
                {myCompany.sede}
              </Text>
          </View>
          <Button radius={"xl"} type="solid" color={'#47D013'} containerStyle={{marginHorizontal: 10, marginVertical: 10}} onPress={() => navigation.navigate('MapaCompaniesPage', {data: allCompanies, myCompany: {lat: myCompany.lat, lng: myCompany.lng}})}>
            <FontAwesome5 name="map-marked-alt" size={24} color="white" />
          </Button>
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Fundadores:</Text>
          <Text style={[styles.textoUser, {width: 230}]}>{myCompany.fundadores}</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Fundação:</Text>
          <Text style={[styles.textoUser, {width: 230}]}>{myCompany.fundacao}</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Atuação:</Text>
          <Text style={[styles.textoUser, {width: 230}]}>{myCompany.atuacao}</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Descrição:</Text>
          <View style={[styles.card, {alignItems: 'center'}]}>
              <Text style={styles.textoDescricao} numberOfLines={3}>
                {myCompany.descricao}
              </Text>
          </View>
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Site:</Text>
          <Text style={[styles.textoUser, {width: 230}]}>{myCompany.site}</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Empresas Físicas:</Text>
          <Text style={[styles.textoUser, {width: 230}]}>{myCompany.empresas}</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Empregados:</Text>
          <Text style={[styles.textoUser, {width: 230}]}>{myCompany.empregados}</Text>
        </View>
        <View style={styles.buttonContainer}>
          {permissionUser ? (
            <Button title="Vagas" titleStyle={{ fontSize: 14 }} onPress={() => {navigation.navigate('MyVagasPage', { dados: keyDoc, email: myCompany.email, permission: true })}}
            buttonStyle={{
                borderWidth: 2,
                borderColor: '#3498DB',
                borderRadius: 30,
            }}
            />
          ) : (
            <Button title="Vagas" titleStyle={{ fontSize: 14 }} onPress={() => {navigation.navigate('MyVagasPage', { dados: keyDoc, email: myCompany.email, permission: false })}}
            buttonStyle={{
                borderWidth: 2,
                borderColor: '#3498DB',
                borderRadius: 30,
            }}
            />
          )}
          {permissionUser ? (
            <Button title="Divulgar nova Vaga" color="error" titleStyle={{ fontSize: 14 }} onPress={() => {navigation.navigate('CreateVagaPage', { dados: keyDoc })}}
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
        <Modal transparent={true} animationType="none" visible={loading}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
            <ActivityIndicator size="large" color="#3498DB" />
          </View>
        </Modal>
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
  rating: {
    marginTop: 10,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingStars: {
    flex: 1,
    alignItems: 'flex-start',
  },
  avaliarButton: {
    marginRight: 20,
  },
  EsqueciSenha: {
    color: '#ff9900',
    fontFamily: 'serif',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  PerfilImage: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  imageContainer: {
    width: '60%',
    alignItems: 'center'
  },
  imagem: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginLeft: 50,
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
    height: '62%',
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
    height: 90,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
});
