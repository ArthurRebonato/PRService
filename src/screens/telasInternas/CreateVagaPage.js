import { StatusBar } from 'expo-status-bar';
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Modal, ActivityIndicator, KeyboardAvoidingView, 
  ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useRoute } from '@react-navigation/native';

import * as VagasService from "../../services/VagasService"

export default function CreateVagaPage(props) {
    const route = useRoute();

    const [keyDocCompany, setKeyDocCompany] = useState("");

    const [form, setForm] = useState({});

    const [loading, setLoading] = useState(false);

    const { navigation } = props;

    const realizarCadastro = async() => {
        if (form.nome && form.local && form.modo && form.experiencia && form.requisito && 
            form.responsabilidade && form.qtdvagas) {
          try {
            setLoading(true);

            const updatedForm = {...form, candidaturas: 0, divulgado: true, uid: `${keyDocCompany}`, nomeLower: `${form.nome}`.toLowerCase()};
            setForm(updatedForm);

            await VagasService.createVaga(updatedForm);

            setLoading(false);
            Alert.alert('Atualização feita com sucesso!', '', 
            [{ text: 'OK', onPress: () => navigation.goBack() }]);
          } catch (error) {
            setLoading(false);
            Alert.alert("Erro ao efetuar alterações");
          }
        } else {
          Alert.alert("Campos preenchidos incorretamente - em branco!");
        }
    }

    useLayoutEffect(() => {
        const requestCompany = async () => {
          try {
            const keyDoc = route.params?.dados;
            setKeyDocCompany(keyDoc);
          } catch (error) {

          }
        };

        requestCompany();
    }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
              <View style={styles.TextoInputs}>
                  <Text style={styles.Texto}>Nome:</Text>
              </View>
              <View style={styles.CaixaTexto}>
                  <TextInput
                  style={styles.Input}
                  placeholder="Informe o Nome da Vaga"
                  autoCapitalize="none"
                  maxLength={30}
                  value={form.nome}
                  onChangeText={(value) => setForm(Object.assign({}, form, { nome: value }))}
                  />
              </View>
              <View style={styles.TextoInputs}>
                  <Text style={styles.Texto}>Local:</Text>
              </View>
              <View style={styles.CaixaTexto}>
                  <TextInput
                  style={styles.Input}
                  placeholder="Informe o local da vaga"
                  autoCapitalize="none"
                  maxLength={70}
                  value={form.local}
                  onChangeText={(value) => setForm(Object.assign({}, form, { local: value }))}
                  />
              </View>
              <View style={styles.TextoInputs}>
                  <Text style={styles.Texto}>Modo:</Text>
              </View>
              <View style={styles.CaixaTexto}>
                  <TextInput
                  style={styles.Input}
                  placeholder="Informe o modo (presencial/híbrido/remoto)"
                  autoCapitalize="none"
                  maxLength={30}
                  value={form.modo}
                  onChangeText={(value) => setForm(Object.assign({}, form, { modo: value }))}
                  />
              </View>
              <View style={styles.TextoInputs}>
                  <Text style={styles.Texto}>Experiência:</Text>
              </View>
              <View style={styles.CaixaTexto}>
                  <TextInput
                  style={styles.Input}
                  placeholder="Informe o tempo de experiencia"
                  autoCapitalize="none"
                  maxLength={30}
                  value={form.experiencia}
                  onChangeText={(value) => setForm(Object.assign({}, form, { experiencia: value }))}
                  />
              </View>
              <View style={styles.TextoInputs}>
                  <Text style={styles.Texto}>Requisitos:</Text>
              </View>
              <View style={styles.descricaoContainer}>
              <TextInput
                  style={{marginLeft: 15, color: '#000', padding: 10}}
                  placeholder="Informe os requisitos"
                  multiline
                  numberOfLines={6}
                  maxLength={150}
                  value={form.requisito}
                  onChangeText={(value) => setForm(Object.assign({}, form, { requisito: value }))}
              />
              </View>
              <View style={styles.TextoInputs}>
                  <Text style={styles.Texto}>Responsabilidades:</Text>
              </View>
              <View style={styles.descricaoContainer}>
              <TextInput
                  style={{marginLeft: 15, color: '#000', padding: 10}}
                  placeholder="Informe as responsabilidades"
                  multiline
                  numberOfLines={6}
                  maxLength={150}
                  value={form.responsabilidade}
                  onChangeText={(value) => setForm(Object.assign({}, form, { responsabilidade: value }))}
              />
              </View>
              <View style={styles.lineContainer}>
                  <View style={styles.TextoInputs}>
                      <Text style={styles.Texto}>Vagas:</Text>
                  </View>
                  <View style={[styles.CaixaTexto, {width: '71%', marginLeft: 15}]}>
                      <TextInput
                      style={styles.Input}
                      placeholder="Informe a quantidade de vagas"
                      autoCapitalize="none"
                      maxLength={10}
                      keyboardType="numeric"
                      value={form.qtdvagas}
                      onChangeText={(value) => setForm(Object.assign({}, form, { qtdvagas: value }))}
                      />
                  </View>
              </View>
              <Modal transparent={true} animationType="none" visible={loading}>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
                      <ActivityIndicator size="large" color="#3498DB" />
                  </View>
              </Modal>
              <View style={styles.button}>
                  <Button radius={"sm"} type="solid" onPress={realizarCadastro}>
                      Criar Vaga
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
      marginTop: 10, 
      width: '45%',
    },
});
