import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Button, StyleSheet, Pressable, 
  Platform, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Dialog } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { uploadToFirebase, getImageFromFirebase } from '../../services/ImagemService';

export default function EditarPerfilPage(props) {
  const user = useSelector(store => store.user)

  const [image, setImage] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [atuacao, setAtuacao] = useState("");
  const [descricao, setDescricao] = useState("");

  const [visibilidadeImagem, setVisibilidadeImagem] = useState(false);
  const [permission, setPermission] = useState({mediaLibraryStatus: null, cameraStatus: null});

  const [data, setData] = useState(new Date());
  const [visibilidadeData, setVisibilidadeData] = useState(false);

  const [selectedDays, setSelectedDays] = useState([false, false, false, false, false, false, false]);

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
  
        const {uri} = result.assets[0];
        const fileName = email;
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
        const fileName = email;
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
        setDataNascimento(currentDate.toLocaleDateString());
      }
    } else {
      toggleDataPicker();
    }
  }

  const confirmIOSDate = () => {
    setDataNascimento(data.toLocaleDateString());
    toggleDataPicker();
  };

  const toggleDay = (index) => {
    const updatedDays = [...selectedDays];
    updatedDays[index] = !updatedDays[index];
    setSelectedDays(updatedDays);
  };

  useLayoutEffect(() => {
    const requestPermissionsAsync = async () => {
      try {
        const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      
        setPermission({
          mediaLibraryStatus: mediaLibraryStatus.status,
          cameraStatus: cameraStatus.status,
        });

        const imageUrl = await getImageFromFirebase(email);
        setImage(imageUrl);
      } catch (error) {
        
      }
    };
    
    requestPermissionsAsync();
  }, []);

  return (
    <View style={styles.container}>
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
          value={nome}
          onChangeText={(e) => setNome(e)}
        />
      </View>
      <View style={styles.TextoInputs}>
        <Text style={styles.Texto}>Email:</Text>
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
        <Text style={styles.Texto}>Endereço:</Text>
      </View>
      <View style={styles.CaixaTexto}>
        <TextInput
          style={styles.Input}
          placeholder="Informe o seu Endereço"
          autoCapitalize="none"
          value={endereco}
          onChangeText={(e) => setEndereco(e)}
        />
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
            value={dataNascimento}
            onChangeText={(e) => setDataNascimento(e)}
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
          value={atuacao}
          onChangeText={(e) => setAtuacao(e)}
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
          value={descricao}
          onChangeText={(e) => setDescricao(e)}
        />
      </View>
      <View style={styles.TextoInputs}>
        <Text style={styles.Texto}>Disponibilidade:</Text>
      </View>
      <View style={styles.disponibilidade}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.day, selectedDays[index] ? styles.selected : null]}
            onPress={() => toggleDay(index)}
          >
            <Text>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.button}>
        <Button title="Salvar alterações"
            buttonStyle={{
                borderWidth: 2,
                borderColor: '#3498DB',
                borderRadius: 30,
            }}
        />
      </View>

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
    borderColor: '#3eccf5',
  },
  button: {
    marginTop: 15, 
    width: '45%',
  },
});