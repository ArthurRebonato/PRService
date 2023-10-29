import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Button, CheckBox } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import * as loginService from "../../services/LoginService"
import * as UserAction from '../../services/actions/userActions'

export default function LoginUser(props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostraSenha, setMostraSenha] = useState(true);

  const [lembreme, setLembreme] = React.useState(false);

  const dispatch = useDispatch()

  const { navigation } = props;

  useLayoutEffect(() => {
    setMostraSenha(true)
    verificarLembreme()
  }, [])

  const verificarLembreme = async() => {
    let emailMemory = await AsyncStorage.getItem("email")
    let senhaMemory = await AsyncStorage.getItem("senha")

    if (emailMemory) {
        setEmail(emailMemory)
        setSenha(senhaMemory)
        setLembreme(true)
    }
  }

  const lembrar = async() => {
    setLembreme(!lembreme)

    if (!lembreme) {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('senha', senha)
    } else {
        await AsyncStorage.removeItem("email")
        await AsyncStorage.removeItem("senha")
    }
  }

  const efetuarLogin = async() => {
    try {
        let user = await loginService.login(email, senha)
        dispatch(UserAction.setUser(user))
        navigation.replace("Home")
    } catch (error) {
        Alert.alert("Erro ao efetuar login", error)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Aviso", "Por favor, insira seu endereço de e-mail.");
      return;
    }
  
    try {
      await loginService.resetPassword(email);
      Alert.alert("Sucesso", "Um email de redefinição de senha foi enviado para o seu email.");
    } catch (error) {
      Alert.alert("Erro", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("../../../assets/logo.png")} />
      </View>
      <View>
        <Text style={styles.Titulo}>Login</Text>
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
          value={email}
          onChangeText={(e) => setEmail(e)}
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
          secureTextEntry={mostraSenha}
          value={senha}
          onChangeText={(e) => setSenha(e)}
        />
        <TouchableOpacity onPress={() => setMostraSenha(!mostraSenha)} 
            style={styles.ImageViewContainer}>
            <Image style={styles.ImageView} source={require("../../../assets/view.png")} />
        </TouchableOpacity>
      </View>
      <View style={styles.lembreme}>
        <CheckBox checked={lembreme} onPress={lembrar} iconType="material-community"
           checkedIcon="checkbox-outline" uncheckedIcon={'checkbox-blank-outline'}  
           title="Lembre-me"
        />
      </View>
      <TouchableOpacity onPress={handleForgotPassword} 
      style={styles.TextoInputs}>
        <Text style={styles.EsqueciSenha}>Esqueci minha senha.</Text>
      </TouchableOpacity>
      <View style={styles.button}>
        <Button title="Acessar"
            buttonStyle={{
                borderWidth: 2,
                borderColor: '#3498DB',
                borderRadius: 30,
            }}
            onPress={efetuarLogin}
        />
      </View>
      <View style={styles.CriarConta}>
        <Text style={styles.Texto}>Não possui uma conta?</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.replace('CadastroUser')} style={{marginTop: 10}}>
        <Text style={styles.EsqueciSenha}>Cadastre-se</Text>
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
  imageContainer: {
    marginTop: 63,
    marginBottom: 38,
  },
  Titulo: {
    color: '#3498DB',
    fontFamily: 'serif',
    fontSize: 40,
    fontStyle: 'normal',
    marginBottom: 40,
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
    marginTop: 15,
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
  ImageViewContainer: {
    paddingRight: 10,
  },
  lembreme: {
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  EsqueciSenha: {
    color: '#3498DB',
    fontFamily: 'serif',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 35, 
    marginBottom: 10, 
    width: '90%',
  },
  CriarConta: {
    marginTop: 20,
    textAlign: 'center',
  },
});
