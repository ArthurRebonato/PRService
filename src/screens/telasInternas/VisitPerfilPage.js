import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect,useLayoutEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Alert, Modal, ActivityIndicator, Linking, ScrollView } from 'react-native';
import { Button, AirbnbRating } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native';

import * as UserService from '../../services/UserService'
import * as ContratoServicoService from '../../services/ContratoServicoService'
import { getImageFromFirebase } from '../../services/ImagemService';
import { getPDFFromFirebase } from '../../services/PDFService';

export default function VisitPerfilPage(props) {
  const route = useRoute();

  const user = useSelector(store => store.user);

  const [allUsers, setAllUsers] = useState([]);
  const [userDados, setUserDados] = useState({});

  let nomeUsuario = userDados.nome;
  let emailUsuario = userDados.email;
  const [image, setImage] = useState("");
  let enderecoUsuario = userDados.endereco;

  let dataNascimentoUsuario = userDados.dataNascimento;
  const [idade, setIdade] = useState(0);

  let atuacaoUsuario = userDados.atuacao;
  let descricaoUsuario = userDados.descricao;
  let disponibilidadeUsuario = userDados.disponibilidade;
  let premium = userDados.premium;
  let avaliacoes = userDados.avaliacoes;

  const [rating, setRating] = useState(0);
  const [newRating, setNewRating] = useState(0);

  const [pdfs, setPDFS] = useState("");

  const [loading, setLoading] = useState(false);
  const [visibleAvaliacao, setVisibleAvaliacao] = useState(false);

  const [curriculo, setCurriculo] = useState(false);

  const { navigation } = props;

  const calcularIdade = async() => {
    if (dataNascimentoUsuario) {
      let partes = dataNascimentoUsuario.split('/');
      let dataNascimento = new Date(partes[2], partes[1] - 1, partes[0]);
      let dataAtual = new Date();
      let diferencaMilissegundos = dataAtual - dataNascimento;
      let milissegundosEmUmAno = 1000 * 60 * 60 * 24 * 365.25;
      setIdade(Math.floor(diferencaMilissegundos / milissegundosEmUmAno))
    }
  }

  const openPDFInBrowser = async (pdfUrl) => {
    try {
      const supported = await Linking.canOpenURL(pdfUrl);
      
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert(`Não é possível abrir o URL: ${pdfUrl}`);
      }
    } catch (error) {
      Alert.alert('Não possuí um curriculo cadastrado!');
    }
  };

  const updateRating = async(newRating) => {
    let updatedUser = {};

    if (avaliacoes > 0){
      const mediaRating = ((userDados.rating + newRating) / 2);
      setRating(mediaRating);
      updatedUser = {...userDados, rating: mediaRating, avaliacoes: (userDados.avaliacoes + 1)};
    } else {
      const mediaRating = (userDados.rating + newRating);
      setRating(mediaRating);
      updatedUser = {...userDados, rating: mediaRating, avaliacoes: (userDados.avaliacoes + 1)};
    }
    
    setUserDados(updatedUser);

    await UserService.updateUser(userDados.uid, updatedUser);
    setVisibleAvaliacao(false);
    Alert.alert('Avaliação realizada com sucesso!');
  };

  const contratarServico = async() => {
    try {
      const pedidoService = {uidContratante: `${user.uid}`, uidPrestador: `${userDados.uid}`, status: false};
      const result = await ContratoServicoService.createContratoServico(pedidoService);

      Alert.alert(result);
    } catch (error) {
      Alert.alert("Erro ao enviar Currículo");
    }
  }

  useLayoutEffect(() => {
    const requestUser = async () => {
      try {
        const key = route.params?.key;

        const curriculo = route.params?.curriculo;
        setCurriculo(curriculo);

        const servicos = route.params?.servicos;
        setAllUsers(servicos);

        let dados = await UserService.getUsersByDocumentUID(key);
        setUserDados(dados);

        setRating(dados.rating);

        const imageUrl = await getImageFromFirebase(`${dados.email}-perfil`);
        setImage(imageUrl);

        const url = await getPDFFromFirebase(`${dados.email}-curriculo`);
        setPDFS(url);
      } catch (error) {

      }
    };

    requestUser();
  }, []);

  useEffect(() => {
    calcularIdade();
  }, [dataNascimentoUsuario]);

  return (
    <View style={styles.container}>
      <Modal transparent={true} animationType="none" visible={visibleAvaliacao}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 300, height: 300, backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: 'black', padding: 20, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'serif', fontSize: 20, fontStyle: 'normal', fontWeight: 'bold', marginBottom: 10 }}>
              Avaliação do usuário
            </Text>
            <Text style={[styles.textoUser, { width: 230 }]}>Marque quantas estrelas esse usuário merece:</Text>
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
          <AirbnbRating count={5} defaultRating={rating} size={20} showRating={false} isDisabled />
          <Text style={[styles.textoUser, {marginLeft: 15, color: '#838383'}]}>{avaliacoes} avaliações</Text>
        </View>
        {curriculo ? (
          <></>
        ) : (
          <View style={styles.avaliarButton}>
            <TouchableOpacity onPress={() => setVisibleAvaliacao(true)}>
              <Text style={styles.EsqueciSenha}>Avaliar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.PerfilImage}>
        <View style={styles.imageContainer}>
          {image != "" ? (
            <Image source={{uri: image}} style={premium ? [styles.imagem, {marginLeft: 50}] : styles.imagem}/>
          ) : (
            <Image source={require("../../../assets/userIcon.png")} style={premium ? [styles.imagem, {marginLeft: 40}] : styles.imagem}/>
          )}
        </View>
        {premium ? (
          <MaterialIcons name="verified" size={30} color="#008BFF" />
        ) : (
          <></>
        )}
      </View>
      <Text style={styles.Titulo}>{nomeUsuario}</Text>
      <ScrollView style={styles.grayBlock}>
        <View style={[styles.linha, { marginTop: 15 }]}>
          <Text style={styles.textoTitulo}>Email:</Text>
          {emailUsuario != "" ? (
            <Text style={styles.textoUser}>{emailUsuario}</Text>
          ) : (
            <Text style={[styles.textoUser, { color: '#ff0000' }]}>Não informado</Text>
          )}
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Endereço:</Text>
          <View style={[styles.card, {height: 73, width: "55%"}]}>
            {enderecoUsuario != "" ? (
              <Text style={styles.textoDescricao} numberOfLines={3}>
                {enderecoUsuario}
              </Text>
            ) : (
              <Text
                style={[styles.textoDescricao, { color: '#ff0000' }]}
                numberOfLines={3}
              >
                Não informado
              </Text>
            )}
          </View>
          <Button radius={"xl"} type="solid" color={'#47D013'} containerStyle={{marginHorizontal: 5, marginVertical: 10}} onPress={() => navigation.navigate('MapaServicosPage', {data: allUsers, myServico: {lat: userDados.lat, lng: userDados.lng}})}>
            <FontAwesome5 name="map-marked-alt" size={20} color="white" />
          </Button>
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Idade:</Text>
          {dataNascimentoUsuario != "" ? (
            <Text style={styles.textoUser}>{idade} anos - {dataNascimentoUsuario}</Text>
          ) : (
            <Text style={[styles.textoUser, { color: '#ff0000' }]}>Não informado</Text>
          )}
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Atuação:</Text>
          {atuacaoUsuario != "" ? (
            <Text style={[styles.textoUser, {width: 230}]}>{atuacaoUsuario}</Text>
          ) : (
            <Text style={[styles.textoUser, { color: '#ff0000' }]}>Não informado</Text>
          )}
        </View>
        <View style={styles.linha}>
          <Text style={styles.textoTitulo}>Descrição:</Text>
          <View style={styles.card}>
            {descricaoUsuario != "" ? (
              <Text style={styles.textoDescricao} numberOfLines={3}>
                {descricaoUsuario}
              </Text>
            ) : (
              <Text
                style={[styles.textoDescricao, { color: '#ff0000' }]}
                numberOfLines={3}
              >
                Não informado
              </Text>
            )}
          </View>
        </View>
        <View style={styles.linha}>
          <Text style={[styles.textoTitulo, {marginBottom: 5}]}>Disponibilidade:</Text>
        </View>
        <View style={styles.disponibilidade}>
          {disponibilidadeUsuario && disponibilidadeUsuario.split('').map((day, index) => (
            <View
              key={index}
              style={[styles.day, day === '1' ? styles.selected : null]}
            >
              <Text>{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index]}</Text>
            </View>
          ))}
        </View>
        <Modal transparent={true} animationType="none" visible={loading}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
            <ActivityIndicator size="large" color="#3498DB" />
          </View>
        </Modal>
        {curriculo ? (
          <View style={[styles.buttonContainer, {justifyContent: 'center'}]}>
            <Button title="Currículo" titleStyle={{ fontSize: 14 }} onPress={() => openPDFInBrowser(pdfs)}
                buttonStyle={{
                    borderWidth: 2,
                    borderColor: '#3498DB',
                    borderRadius: 30,
                }}
            />
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button title="Currículo" titleStyle={{ fontSize: 14 }} onPress={() => openPDFInBrowser(pdfs)}
                buttonStyle={{
                    borderWidth: 2,
                    borderColor: '#3498DB',
                    borderRadius: 30,
                }}
            />
            {user.uid === userDados.uid ? (
              <></>
            ) : (
              <Button title="Contratar Serviço" color="error" titleStyle={{ fontSize: 14 }} onPress={() => contratarServico()}
              buttonStyle={{
                  borderWidth: 2,
                  borderColor: '#ff0000',
                  borderRadius: 30,
              }}
              />
            )}
          </View>
        )}
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
  },
  imageContainer: {
    width: '75%',
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
    alignSelf: 'flex-end',
  },
  Titulo: {
    fontFamily: 'serif',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'bold',
    marginTop: 5,
  },
  grayBlock: {
    width: '90%',
    height: '58%',
    backgroundColor: '#e6ecff',
    margin: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C2C2C2',
  },
  linha: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 14,
  },
  textoTitulo: {
    fontFamily: 'serif',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'bold',
    marginRight: 15,
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
  disponibilidade: {
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 15,
    marginBottom: 15,
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selected: {
    backgroundColor: '#6fdfff',
    borderColor: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
