import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Pressable, Platform, Alert, Modal, 
  ActivityIndicator, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Icon, Dialog } from '@rneui/themed';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as UserService from '../../services/UserService'
import { uploadToFirebase, getImageFromFirebase } from '../../services/ImagemService';

export default function EditarPerfilPage(props) {
  const user = useSelector(store => store.user)

  const [form, setForm] = useState({});

  const [image, setImage] = useState("");

  const [visibilidadeImagem, setVisibilidadeImagem] = useState(false);
  const [permission, setPermission] = useState({mediaLibraryStatus: null, cameraStatus: null});

  const [data, setData] = useState(new Date());
  const [visibilidadeData, setVisibilidadeData] = useState(false);

  const [selectedDays, setSelectedDays] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [loading, setLoading] = useState(false);

  const { navigation } = props;

  const buscarUserBD = async() => {
    try {
        let dados = await UserService.getUserUid(user.uid)

        if (dados.length > 0) {
          const userData = dados[0];
          const updatedForm = {
            ...form,
            nome: userData.nome,
            email: userData.email,
            endereco: userData.endereco,
            rua: userData.rua,
            regiao: userData.regiao,
            dataNascimento: userData.dataNascimento,
            atuacao: userData.atuacao,
            descricao: userData.descricao,
            disponibilidade: userData.disponibilidade,
            curriculo: userData.curriculo,
            divulgado: userData.divulgado,
            premium: userData.premium,
            avaliacoes: userData.avaliacoes,
            rating: userData.rating,
            uid: userData.uid,
          };
          setForm(updatedForm);
        }
    } catch (error) {
        
    }
  }

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

        const {uri} = result.assets[0];
        const fileName = `${user.email}-perfil`;
        await uploadToFirebase(uri, fileName);
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

        const {uri} = cameraResp.assets[0];
        const fileName = `${user.email}-perfil`;
        await uploadToFirebase(uri, fileName);
      }
    } catch (error) {
      Alert.alert("Error no upload da imagem", error.message);
    }
  }

  const toggleDataPicker = () => {
    setVisibilidadeData(!visibilidadeData);
  }

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setData(currentDate);

      if (Platform.OS === "android") {
        toggleDataPicker();
        setForm(Object.assign({}, form, { dataNascimento: currentDate.toLocaleDateString() }))
      }
    } else {
      toggleDataPicker();
    }
  }

  const confirmIOSDate = () => {
    setForm(Object.assign({}, form, { dataNascimento: data.toLocaleDateString() }))
    toggleDataPicker();
  };

  const toggleDay = (index) => {
    const updatedDays = [...selectedDays];
    updatedDays[index] = updatedDays[index] === 1 ? 0 : 1;
    setSelectedDays(updatedDays);
    setForm(Object.assign({}, form, { disponibilidade: updatedDays.join('') }));
  };

  const efetuarAlteracoes = async() => {
    if (image != "") {
      if (form.nome && form.email && form.rua && form.regiao && form.dataNascimento && form.atuacao && form.descricao && form.disponibilidade != '0000000') {
        try {
          setLoading(true);
  
          const updatedForm = {...form, endereco: `${form.rua}, ${form.regiao}`, atuacaoLower: `${form.atuacao}`.toLowerCase()};
          setForm(updatedForm);
  
          await UserService.updateUser(user.uid, updatedForm);
  
          setLoading(false);
          Alert.alert('Atualização feita com sucesso!', '', 
          [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } catch (error) {
          setLoading(false);
          Alert.alert("Erro ao efetuar alterações", error);
        }
      } else {
        Alert.alert("Campos preenchidos incorretamente - em branco!");
      }
    } else {
      Alert.alert("Imagem não preenchida!");
    }
  }

  useEffect(() => {
    if (form.disponibilidade) {
      setSelectedDays(form.disponibilidade.split('').map(Number));
    }
  }, [form.disponibilidade]);

  useLayoutEffect(() => {
    const requestPermissionsAsync = async () => {
      try {
        const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      
        setPermission({
          mediaLibraryStatus: mediaLibraryStatus.status,
          cameraStatus: cameraStatus.status,
        });

        buscarUserBD();

        const imageUrl = await getImageFromFirebase(`${user.email}-perfil`);
        setImage(imageUrl);
      } catch (error) {
        
      }
    };
    
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
                  <Text style={styles.Texto}>Foto do Perfil</Text>
                  <Text style={styles.Texto}>Escolha uma foto para Perfil</Text>
              </View>
            </View>
            <View style={styles.TextoInputs}>
              <Text style={styles.Texto}>Nome Completo:</Text>
            </View>
            <View style={styles.CaixaTexto}>
              <TextInput
                style={styles.Input}
                placeholder="Informe o seu Nome Completo"
                autoCapitalize="none"
                maxLength={30}
                value={form.nome}
                onChangeText={(value) => setForm(Object.assign({}, form, { nome: value }))}
              />
            </View>
            <View style={styles.TextoInputs}>
              <Text style={styles.Texto}>Email:</Text>
            </View>
            <View style={styles.CaixaTexto}>
              <TextInput
                style={[styles.Input, { color: 'gray' }]}
                placeholder="Informe o seu Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={form.email}
                editable={false}
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flex: 1, marginTop: 15, marginLeft: 30, marginBottom: 3}}>
                <Text style={styles.Texto}>Endereço:</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end', marginTop: 15, marginBottom: 3, marginRight: 50}}>
                <Text style={styles.Texto}>Cidade/Estado:</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={[styles.CaixaTexto, {width: '50%', marginRight: 20}]}>
                <TextInput
                  style={styles.Input}
                  placeholder="Rua, nº - Bairro"
                  autoCapitalize="none"
                  maxLength={50}
                  value={form.rua}
                  onChangeText={(value) => setForm(Object.assign({}, form, { rua: value }))}
                />
              </View>
              <View style={[styles.CaixaTexto, {width: '30%'}]}>
                <TextInput
                  style={[styles.Input, {fontSize: 10}]}
                  placeholder="Cidade - Sigla Estado"
                  autoCapitalize="none"
                  maxLength={20}
                  value={form.regiao}
                  onChangeText={(value) => setForm(Object.assign({}, form, { regiao: value }))}
                />
              </View>
            </View>
            <View style={styles.dataContainer}>
              <View style={[styles.TextoInputs, {marginRight: 20}]}>
                <Text style={styles.Texto}>Data de Nascimento:</Text>
              </View>
              <View style={[styles.CaixaTexto, {width: '30%'}]}>
                {visibilidadeData && (<DateTimePicker mode='date' display='spinner' 
                value={data} onChange={onChange} style={styles.dataPicker} maximumDate={new Date()} 
                minimumDate={new Date('1900-1-2')} />)}

                {visibilidadeData && Platform.OS === "ios" && (
                  <View style={{flexDirection: "row", justifyContent: "space-around"}}>
                    <TouchableOpacity style={[styles.buttonData, styles.pickerButtonData, {backgroundColor: "#11182711"}]}
                      onPress={toggleDataPicker}
                    >
                      <Text style={[styles.buttonText, {color: "#075985"}]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonData, styles.pickerButtonData]}
                      onPress={confirmIOSDate}
                    >
                      <Text style={styles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {!visibilidadeData && (
                  <Pressable onPress={toggleDataPicker}>
                    <TextInput
                    style={styles.Input}
                    placeholder="DD/MM/AAAA"
                    autoCapitalize="none"
                    value={form.dataNascimento}
                    onChangeText={(value) => setForm(Object.assign({}, form, { dataNascimento: value }))}
                    editable={false}
                    onPressIn={toggleDataPicker}
                    />
                  </Pressable>
                )}
              </View>
            </View>
            <View style={styles.TextoInputs}>
              <Text style={styles.Texto}>Atuação:</Text>
            </View>
            <View style={styles.CaixaTexto}>
              <TextInput
                style={styles.Input}
                placeholder="Informe no que você Atua"
                autoCapitalize="none"
                maxLength={29}
                value={form.atuacao}
                onChangeText={(value) => setForm(Object.assign({}, form, { atuacao: value }))}
              />
            </View>
            <View style={styles.TextoInputs}>
              <Text style={styles.Texto}>Descrição:</Text>
            </View>
            <View style={styles.descricaoContainer}>
              <TextInput
                style={{marginLeft: 15, color: '#000', padding: 10}}
                placeholder="Informe sua descrição"
                multiline
                numberOfLines={4}
                maxLength={116}
                value={form.descricao}
                onChangeText={(value) => setForm(Object.assign({}, form, { descricao: value }))}
              />
            </View>
            <View style={styles.TextoInputs}>
              <Text style={styles.Texto}>Disponibilidade:</Text>
            </View>
            <View style={styles.disponibilidade}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.day, selectedDays[index] === 1 ? styles.selected : null]}
                  onPress={() => toggleDay(index)}
                >
                  <Text>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Modal transparent={true} animationType="none" visible={loading}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
                <ActivityIndicator size="large" color="#3498DB" />
              </View>
            </Modal>
            <View style={styles.button}>
              <Button radius={"sm"} type="solid" onPress={efetuarAlteracoes}>
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
  dataContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
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
  dataPicker: {
    height: 120,
    marginTop: -10,
  },
  buttonData: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: '#075958',
  },
  pickerButtonData: {
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  disponibilidade: {
    flexDirection: 'row',
    marginTop: 10,
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#000',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selected: {
    backgroundColor: '#3eccf5',
    borderColor: '#000',
  },
  button: {
    marginTop: 15, 
    width: '45%',
  },
});