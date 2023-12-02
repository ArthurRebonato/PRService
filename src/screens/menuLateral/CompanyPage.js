import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Button } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function CompanyPage(props) {

  const { navigation } = props;

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/company.jpg")} style={styles.imagem}/>
      <View style={styles.button}>
        <Button title="Criar uma nova Empresa" onPress={() => {navigation.navigate('CreateCompanyPage')}}
            buttonStyle={{
                borderWidth: 2,
                borderColor: '#3498DB',
                borderRadius: 30,
            }}
        />
      </View>
      <View style={styles.button}>
        <Button title="Minhas Empresas" type="outline" onPress={() => {navigation.navigate('MyCompanyPage', { tipo: true })}}
            buttonStyle={{
                borderWidth: 2,
                borderColor: '#3498DB',
                borderRadius: 30,
            }}
        />
      </View>
      <View style={styles.buttonCurriculo}>
        <Button radius={"md"} type="solid" color={'#FF0000'} onPress={() => {navigation.navigate('MyCompanyPage', { tipo: false })}}> 
          <MaterialCommunityIcons name="file-send-outline" size={28} color="white" />
          <Text style={{color: 'white', fontSize: 18, fontStyle: 'italic'}}>Currículos</Text>
        </Button>
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
  imagem: {
    width: 200,
    height: 200,
    borderRadius: 30,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 50,
    marginBottom: 70,
  },
  button: {
    marginTop: 30, 
    marginBottom: 10, 
    width: '90%',
  },
  buttonCurriculo: {
    marginTop: 200,
    marginBottom: 10, 
  },
});