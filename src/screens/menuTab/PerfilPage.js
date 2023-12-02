import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Alert, Modal, ActivityIndicator, Linking, ScrollView } from 'react-native';
import { Button, Dialog, AirbnbRating } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { Feather, MaterialIcons } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker';

import * as UserService from '../../services/UserService'
import { getImageFromFirebase } from '../../services/ImagemService';
import { uploadPDFFirebase, getPDFFromFirebase } from '../../services/PDFService';

export default function PerfilPage(props) {
  const { navigation } = props;

  const user = useSelector(store => store.user);

  const [userDados, setUserDados] = useState([]);

  let nomeUsuario = userDados[0]?.nome;
  let emailUsuario = userDados[0]?.email;
  const [image, setImage] = useState("");
  let enderecoUsuario = userDados[0]?.endereco;

  let dataNascimentoUsuario = userDados[0]?.dataNascimento;
  const [idade, setIdade] = useState(0);

  let atuacaoUsuario = userDados[0]?.atuacao;
  let descricaoUsuario = userDados[0]?.descricao;
  let disponibilidadeUsuario = userDados[0]?.disponibilidade;
  let divulgadoUsuario = userDados[0]?.divulgado;
  let premium = userDados[0]?.premium;

  let rating = userDados[0]?.rating;

  const [pdfs, setPDFS] = useState("");
  const [visibilidadePdfs, setVisibilidadePdfs] = useState(false);

  const [loading, setLoading] = useState(false);

  const buscarUserBD = async() => {
    try {
        let dados = await UserService.getUserUid(user.uid)
        setUserDados(dados)
    } catch (error) {
        
    }
  }

  const calcularIdade = async() => {
    if (dataNascimentoUsuario) {
      let partes = dataNascimentoUsuario.split('/');
      let dataNascimento = new Date(partes[2], partes[1] - 1, partes[0]);
      let dataAtual = new Date();

      let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();

      if (dataAtual.getMonth() < dataNascimento.getMonth() || (dataAtual.getMonth() === dataNascimento.getMonth() && dataAtual.getDate() < dataNascimento.getDate())) {
        idade--;
      }

      setIdade(idade);
    }
  }

  const divulgarPerfil = async (acao) => {
    try {
      if (nomeUsuario && emailUsuario && enderecoUsuario && dataNascimentoUsuario && atuacaoUsuario &&
        descricaoUsuario && (disponibilidadeUsuario !== null && disponibilidadeUsuario !== "0000000")
      ) {
        userDados[0].divulgado = acao;

        await UserService.updateUser(user.uid, userDados[0]);

        if (acao) {
          Alert.alert('Divulgação feita com sucesso!');
        } else {
          Alert.alert('Removido a divulgação do perfil!');
        }
      } else {
        Alert.alert('Informações do perfil em branco - Adicione as que faltam!');
      }
    } catch (error) {
      Alert.alert("Erro ao atualizar divulgação do perfil", error);
    }
  }

  const toggleDialogPDF = () => {
    setVisibilidadePdfs(!visibilidadePdfs);
  };

  const handlePDFPicker = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
  
      if (!result.canceled) {
        const { uri } = result.assets[0];

        const fileName = `${user.email}-curriculo`; 
        await uploadPDFFirebase(uri, fileName);

        setLoading(false)
        Alert.alert('Upload de PDF concluído com sucesso!');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Erro no upload do PDF', error.message);
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

  useEffect(() => {
    const requestUser = async () => {
      try {
        buscarUserBD()
        calcularIdade()
        const imageUrl = await getImageFromFirebase(`${user.email}-perfil`);
        setImage(imageUrl);

        const url = await getPDFFromFirebase(`${user.email}-curriculo`);
        setPDFS(url);
      } catch (error) {
        
      }
    };

    requestUser();
  }, [{ navigation }])

  return (
    <View style={styles.container}>
      <View style={styles.rating}>
        <AirbnbRating count={5} defaultRating={rating} size={20} showRating={false} isDisabled />
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
        <TouchableOpacity style={styles.editIcon} onPress={() => {navigation.navigate('EditarPerfilPage')}}>
          <Feather name="edit" size={24} color="black" />
        </TouchableOpacity>
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
          <View style={[styles.card, {height: 70,}]}>
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
            <Text style={styles.textoUser}>{atuacaoUsuario}</Text>
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
          <Text style={styles.textoTitulo}>Disponibilidade:</Text>
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
        <View style={[styles.buttonContainer, {marginBottom: 10}]}>
          <Button title="Currículo" titleStyle={{ fontSize: 13 }} onPress={toggleDialogPDF}
              buttonStyle={{
                  borderWidth: 2,
                  borderColor: '#3498DB',
                  borderRadius: 30,
              }}
          />
          <Dialog isVisible={visibilidadePdfs} onBackdropPress={toggleDialogPDF} style={{flex: 1}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Dialog.Title title="Upload PDFs" />
              <Text>Escolha se você quer visualizar o teu currículo ou escolher um novo.</Text>
              <Dialog.Actions>
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: 40}}>
                    <Dialog.Button title="Visualizar" onPress={() => openPDFInBrowser(pdfs)}/>
                  </View>
                    <Dialog.Button title="Novo" onPress={handlePDFPicker} />
                </View>
              </Dialog.Actions>
            </View>
          </Dialog>
          {divulgadoUsuario ? (
            <Button title="Remover Divulgação" color="error" titleStyle={{ fontSize: 13 }} onPress={() => divulgarPerfil(false)}
            buttonStyle={{
                borderWidth: 2,
                borderColor: '#ff0000',
                borderRadius: 30,
            }}
            />
            ) : (
            <Button title="Divulgar Perfil" color="error" titleStyle={{ fontSize: 13 }} onPress={() => divulgarPerfil(true)}
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
  rating: {
    marginTop: 10,
    marginLeft: 15,
    alignSelf: 'flex-start',
    flexDirection: 'row',
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
    marginTop: 8,
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
    marginBottom: 12,
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
