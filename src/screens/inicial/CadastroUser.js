import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Button, StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dialog, CheckBox } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';

import * as loginService from "../../services/LoginService"
import * as UserAction from '../../services/actions/userActions'
import * as UserService from '../../services/UserService'
import { uploadToFirebase, getImageFromFirebase } from '../../services/ImagemService';

export default function CadastroScreen(props) {
    const [form, setForm] = useState({});

    const [image, setImage] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [visibilidadeImagem, setVisibilidadeImagem] = useState(false);
    const [permission, setPermission] = useState({mediaLibraryStatus: null, cameraStatus: null});

    const [aceitoTermos, setAceitoTermos] = React.useState(false);
    const toggleCheckbox = () => setAceitoTermos(!aceitoTermos);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()

    const { navigation } = props;

    const toggleDialogImage = () => {
      setVisibilidadeImagem(!visibilidadeImagem);
    };
  
    const handleImagePicker = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          aspect: [4, 4],
          allowsEditing: true,
          base64: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      } catch (error) {
        Alert.alert("Error no upload da imagem", error.message);
      }
    }
  
    const handlePhoto = async () => {
      try {
        const cameraResp = await ImagePicker.launchCameraAsync({
          aspect: [4, 4],
          allowsEditing: true,
          base64: true,
          quality: 1,
        })
    
        if (!cameraResp.canceled) {
          setImage(cameraResp.assets[0].uri);
        }
      } catch (error) {
        Alert.alert("Error no upload da imagem", error.message);
      }
    }

    const efetuarCadastro = async() => {
      if (image != "" && form.nome && form.email && senha != "" && confirmarSenha != "") {
        if (senha === confirmarSenha) {
          if (aceitoTermos){
            try {
              let retorno = await loginService.createUser(form.email, senha);
              Alert.alert(retorno, '', [{ text: 'OK', onPress: () => setLoading(true) }]);

              try {
                let user = await loginService.login(form.email, senha);
                dispatch(UserAction.setUser(user));

                const updatedForm = {...form, endereco: 'não informado', dataNascimento: 'não informado',
                  atuacao: 'não informado', descricao: 'não informado', disponibilidade: '0000000', 
                  curriculo: 'não informado', divulgado: false, uid: `${user.uid}`};
                setForm(updatedForm);
                await UserService.createUserBD(updatedForm);
                await uploadToFirebase(image, form.email);
                navigation.replace("Home");
              } catch (error) {
                Alert.alert("Erro ao efetuar login", error);
              }
            } catch (error) {
              Alert.alert("Erro ao cadastrar usuário", error);
            } finally {
              setLoading(false);
            }
          } else {
            Alert.alert("Você não aceitou os Termos de Serviço!");
          }
        } else {
          Alert.alert("Senhas estão diferentes uma da outra!");
        }
      } else {
        Alert.alert("Campos preenchidos incorretamente - em branco!");
      }
    }

    useLayoutEffect(() => {
      const requestPermissionsAsync = async () => {
        try {
          const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
          const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        
          setPermission({
            mediaLibraryStatus: mediaLibraryStatus.status,
            cameraStatus: cameraStatus.status,
          });
  
          const imageUrl = await getImageFromFirebase(form.email);
          setImage(imageUrl);
        } catch (error) {
          
        }
      };
      
      requestPermissionsAsync();
    }, []);

  return (
    <View style={styles.container}>
      <Modal transparent={true} animationType="none" visible={loading}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
          <ActivityIndicator size="large" color="#3498DB" />
        </View>
      </Modal>
      <View>
        <Text style={styles.Titulo}>Seja Bem-Vindo!</Text>
      </View>
      <View style={styles.Perfil}>
        <View style={styles.imageContainer}>
        <TouchableOpacity onPress={toggleDialogImage}>
              {image != "" ? (
                <Image source={{uri: image}} style={styles.imagem}/>
              ) : (
                <Image source={require("../../../assets/userIcon.png")} style={styles.imagem}/>
              )}
            </TouchableOpacity>
        </View>
        <Dialog isVisible={visibilidadeImagem} onBackdropPress={toggleDialogImage} style={{flex: 1}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Dialog.Title title="Upload Foto" />
            <Text>Escolha se você quer fazer upload de uma foto ou tirar uma foto.</Text>
            <Dialog.Actions>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: 40}}>
                  <Dialog.Button title="Arquivos" onPress={handleImagePicker}/>
                </View>
                  <Dialog.Button title="Câmera" onPress={handlePhoto}/>
              </View>
            </Dialog.Actions>
          </View>
        </Dialog>
        <View style={styles.textContainer}>
            <Text style={styles.Texto}>Foto do Perfil</Text>
            <Text style={styles.Texto}>Escolha ou tire uma foto</Text>
        </View>
      </View>
      <View style={styles.TextoInputs}>
        <Text style={styles.Texto}>Nome Completo</Text>
      </View>
      <View style={styles.CaixaTexto}>
        <TextInput
          style={styles.Input}
          placeholder="Informe o seu Nome Completo"
          autoCapitalize="none"
          value={form.nome}
          onChangeText={(value) => setForm(Object.assign({}, form, { nome: value }))}
        />
      </View>
      <View style={styles.TextoInputs}>
        <Text style={styles.Texto}>Email</Text>
      </View>
      <View style={styles.CaixaTexto}>
        <TextInput
          style={styles.Input}
          placeholder="Informe o seu Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(value) => setForm(Object.assign({}, form, { email: value }))}
        />
      </View>
      <View style={styles.TextoInputs}>
        <Text style={styles.Texto}>Senha</Text>
      </View>
      <View style={styles.CaixaTexto}>
        <TextInput
          style={styles.Input}
          placeholder="Informe a sua Senha"
          autoCapitalize="none"
          secureTextEntry
          value={senha}
          onChangeText={(e) => setSenha(e)}
        />
      </View>
      <View style={styles.TextoInputs}>
        <Text style={styles.Texto}>Confirma a Senha</Text>
      </View>
      <View style={styles.CaixaTexto}>
        <TextInput
          style={styles.Input}
          placeholder="Confirme a sua Senha"
          autoCapitalize="none"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={(e) => setConfirmarSenha(e)}
        />
      </View>
      <View style={styles.lembreme}>
        <CheckBox checked={aceitoTermos} onPress={toggleCheckbox} iconType="material-community"
           checkedIcon="checkbox-outline" uncheckedIcon={'checkbox-blank-outline'}  
           title="Aceito os Termos de uso e Políticas de privacidades."
        />
      </View>
      <View style={styles.button}>
        <Button title="Cadastrar"
            buttonStyle={{
                borderWidth: 2,
                borderColor: '#3498DB',
                borderRadius: 30,
            }}
            onPress={efetuarCadastro}
        />
      </View>
      <View style={styles.CriarConta}>
        <Text style={styles.Texto}>Já possui uma conta?</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.replace('LoginUser')} style={{marginTop: 10}}>
        <Text style={styles.EsqueciSenha}>Logar</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  Titulo: {
    marginTop: 23,
    color: '#3498DB',
    fontFamily: 'serif',
    fontSize: 40,
    fontStyle: 'normal',
  },
  Perfil: {
    flexDirection: 'row',
    width: '90%',
    height: 100,
    marginTop: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  textContainer: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  Texto: {
    color: '#000',
    fontFamily: 'serif',
    fontSize: 17,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  TextoInputs: {
    alignSelf: 'flex-start',
    marginTop: 20,
    marginLeft: 30,
    marginBottom: 9,
  },
  CaixaTexto: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 3,
    borderRadius: 10,
    margin: 5,
    borderColor: '#a0a0a0',
    height: 55,
    width: '90%',
    alignItems: 'center',
  },
  Input: {
    flex: 1,
    marginLeft: 20,
  },
  lembreme: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 10,
  },
  button: {
    marginTop: 20, 
    marginBottom: 10, 
    width: '90%',
  },
  EsqueciSenha: {
    color: '#3498DB',
    fontFamily: 'serif',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  CriarConta: {
    marginTop: 10,
    textAlign: 'center',
  },
});
