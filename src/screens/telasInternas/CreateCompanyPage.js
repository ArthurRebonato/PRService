import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ActivityIndicator,
  KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Icon, Dialog } from '@rneui/themed';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

import * as CompanyService from "../../services/CompanyService"

import { uploadToFirebase, getImageFromFirebase } from '../../services/ImagemService';

export default function CreateCompanyPage(props) {
    const user = useSelector(store => store.user)

    const [form, setForm] = useState({});

    const [image, setImage] = useState("");

    const [visibilidadeImagem, setVisibilidadeImagem] = useState(false);
    const [permission, setPermission] = useState({mediaLibraryStatus: null, cameraStatus: null});

    const { navigation } = props;

    const [loading, setLoading] = useState(false);

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

    const efetuarCadastroCompany = async() => {
      if (image != "") {
        if (form.nome && form.email && form.sede && form.fundadores && form.fundacao && form.atuacao 
          && form.descricao && form.site && form.empresas && form.empregados) {
            try {
              setLoading(true);
  
              const updatedForm = {...form, divulgado: false, premium: false, uid: `${user.uid}`, 
              avaliacoes: 0, rating: 0};
              setForm(updatedForm);
  
              await CompanyService.createCompanyBD(updatedForm);
  
              Alert.alert("Empresa criada com sucesso!");
  
              await uploadToFirebase(image, `${form.email}-perfilCompany`);
              setLoading(false);
  
              navigation.navigate('CompanyPage');
            } catch (error) {
              setLoading(false);
              Alert.alert("Erro ao cadastrar usuário");
            }
        } else {
          Alert.alert("Campos preenchidos incorretamente - em branco!");
        }
      } else {
        Alert.alert("Imagem não preenchida!");
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
  
          const imageUrl = await getImageFromFirebase(`${form.email}-perfilCompany`);
          setImage(imageUrl);
        } catch (error) {
          
        }
      };
      setImage('')
      setForm({})
      
      requestPermissionsAsync();
    }, []);

    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.Perfil}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={toggleDialogImage}>
                      {image != "" ? (
                        <Image source={{uri: image}} style={styles.imagem}/>
                      ) : (
                        <Image source={require("../../../assets/addUserIcon.png")} style={[styles.imagem, {borderWidth: 0, borderRadius: 10}]}/>
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
                    <Text style={styles.Texto}>Foto da Empresa</Text>
                    <Text style={styles.Texto}>Escolha uma foto para Perfil</Text>
                </View>
              </View>
              <View style={styles.lineContainer}>
                <View style={styles.TextoInputs}>
                    <Text style={styles.Texto}>Nome:</Text>
                </View>
                <View style={[styles.CaixaTexto, {width: '71%', marginLeft: 15}]}>
                    <TextInput
                    style={styles.Input}
                    placeholder="Informe o Nome da Empresa"
                    autoCapitalize="none"
                    maxLength={30}
                    value={form.nome}
                    onChangeText={(value) => setForm(Object.assign({}, form, { nome: value }))}
                    />
                </View>
              </View>
              <View style={styles.lineContainer}>
                <View style={styles.TextoInputs}>
                  <Text style={styles.Texto}>Email:</Text>
                </View>
                <View style={[styles.CaixaTexto, {width: '71%', marginLeft: 15}]}>
                  <TextInput
                    style={styles.Input}
                    placeholder="Informe o Email da Empresa"
                    autoCapitalize="none"
                    maxLength={30}
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={(value) => setForm(Object.assign({}, form, { email: value }))}
                  />
                </View>
              </View>
              <View style={styles.TextoInputs}>
                <Text style={styles.Texto}>Sede:</Text>
              </View>
              <View style={styles.CaixaTexto}>
                <TextInput
                  style={styles.Input}
                  placeholder="Informe o endereço da sede"
                  autoCapitalize="none"
                  maxLength={70}
                  value={form.sede}
                  onChangeText={(value) => setForm(Object.assign({}, form, { sede: value }))}
                />
              </View>
              <View style={styles.lineContainer}>
                <View style={styles.TextoInputs}>
                  <Text style={styles.Texto}>Fundadores:</Text>
                </View>
                <View style={[styles.CaixaTexto, {width: '62%', marginLeft: 15}]}>
                  <TextInput
                    style={styles.Input}
                    placeholder="Informe os fundadores"
                    autoCapitalize="none"
                    maxLength={50}
                    value={form.fundadores}
                    onChangeText={(value) => setForm(Object.assign({}, form, { fundadores: value }))}
                  />
                </View>
              </View>
              <View style={styles.lineContainer}>
                <View style={styles.TextoInputs}>
                    <Text style={styles.Texto}>Fundação:</Text>
                </View>
                <View style={[styles.CaixaTexto, {width: '65%', marginLeft: 15}]}>
                    <TextInput
                    style={styles.Input}
                    placeholder="Informe o (Ano - Região)"
                    autoCapitalize="none"
                    maxLength={25}
                    value={form.fundacao}
                    onChangeText={(value) => setForm(Object.assign({}, form, { fundacao: value }))}
                    />
                </View>
              </View>
              <View style={styles.lineContainer}>
                <View style={styles.TextoInputs}>
                    <Text style={styles.Texto}>Atuação:</Text>
                </View>
                <View style={[styles.CaixaTexto, {width: '67%', marginLeft: 15}]}>
                    <TextInput
                    style={styles.Input}
                    placeholder="Informe a área de atuação"
                    autoCapitalize="none"
                    maxLength={30}
                    value={form.atuacao}
                    onChangeText={(value) => setForm(Object.assign({}, form, { atuacao: value }))}
                    />
                </View>
              </View>
              <View style={styles.TextoInputs}>
                <Text style={styles.Texto}>Descrição:</Text>
              </View>
              <View style={styles.descricaoContainer}>
                <TextInput
                  style={{marginLeft: 15, color: '#000', padding: 10}}
                  placeholder="Informe a descrição da Empresa"
                  multiline
                  numberOfLines={4}
                  maxLength={116}
                  value={form.descricao}
                  onChangeText={(value) => setForm(Object.assign({}, form, { descricao: value }))}
                />
              </View>
              <View style={styles.lineContainer}>
                <View style={styles.TextoInputs}>
                    <Text style={styles.Texto}>Site:</Text>
                </View>
                <View style={[styles.CaixaTexto, {width: '74%', marginLeft: 15}]}>
                    <TextInput
                    style={styles.Input}
                    placeholder="Informe o site da Empresa"
                    autoCapitalize="none"
                    maxLength={30}
                    value={form.site}
                    onChangeText={(value) => setForm(Object.assign({}, form, { site: value }))}
                    />
                </View>
              </View>
              <View style={styles.lineContainer}>
                <View style={styles.TextoInputs}>
                    <Text style={styles.Texto}>Empresas Físicas:</Text>
                </View>
                <View style={[styles.CaixaTexto, {width: '52%', marginLeft: 15}]}>
                    <TextInput
                    style={styles.Input}
                    placeholder="Informe a quantidade"
                    autoCapitalize="none"
                    maxLength={10}
                    keyboardType="numeric"
                    value={form.empresas}
                    onChangeText={(value) => setForm(Object.assign({}, form, { empresas: value }))}
                    />
                </View>
              </View>
              <View style={styles.lineContainer}>
                <View style={styles.TextoInputs}>
                    <Text style={styles.Texto}>Empregados:</Text>
                </View>
                <View style={[styles.CaixaTexto, {width: '60%', marginLeft: 15}]}>
                    <TextInput
                    style={styles.Input}
                    placeholder="Informe a quantidade"
                    autoCapitalize="none"
                    maxLength={10}
                    keyboardType="numeric"
                    value={form.empregados}
                    onChangeText={(value) => setForm(Object.assign({}, form, { empregados: value }))}
                    />
                </View>
              </View>
              <Modal transparent={true} animationType="none" visible={loading}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
                  <ActivityIndicator size="large" color="#3498DB" />
                </View>
              </Modal>
              <View style={styles.button}>
                <Button radius={"sm"} type="solid" onPress={efetuarCadastroCompany}>
                  Salvar Alterações
                  <Icon name="save" color="white" style={{marginLeft: 10}}/>
                </Button>
              </View>
        
              <StatusBar style="auto" />
            </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    Perfil: {
      flexDirection: 'row',
      width: '80%',
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
      fontSize: 14,
      fontStyle: 'italic',
    },
    TextoInputs: {
      alignSelf: 'flex-start',
      marginTop: 15,
      marginLeft: 30,
      marginBottom: 3,
    },
    CaixaTexto: {
      flexDirection: 'row',
      borderWidth: 1,
      margin: 5,
      borderColor: '#fff',
      borderBlockEndColor: '#000',
      height: 40,
      width: '85%',
    },
    lineContainer: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
    },
    descricaoContainer: {
      borderWidth: 1,
      margin: 5,
      borderColor: '#000',
      width: '85%',
      borderRadius: 10,
    },
    Input: {
      flex: 1,
      marginLeft: 15,
      color: '#000',
    },
    button: {
      marginTop: 15, 
      width: '45%',
    },
});
