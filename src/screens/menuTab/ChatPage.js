import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { Divider, Input } from '@rneui/themed';

import * as ChatService from '../../services/ChatService'
import * as UserService from '../../services/UserService'

import RegistroChat from '../../components/RegistroChat';

import { getImageFromFirebase } from '../../services/ImagemService';

export default function ChatPage(props) {
  const user = useSelector(store => store.user);

  const [image, setImage] = useState("");

  const [chatUser, setChatUser] = useState([])
  const [chatUserOriginal, setChatUserOriginal] = useState([])

  const { navigation } = props;

  const buscarChat = async () => {
    try {
      let dadosChat = await ChatService.getChatByuidUser(user.uid);
  
      const chatsComInfoUsuario = await Promise.all(
        dadosChat.map(async (chat) => {
          const outroUserID = chat.user1 === user.uid ? chat.user2 : chat.user1;
          const dadosOutroUser = await UserService.getUserUid(outroUserID);
          return { ...chat, nome: dadosOutroUser[0]?.nome, email: dadosOutroUser[0]?.email };
        })
      );

      const chatsOrdenados = chatsComInfoUsuario.sort((a, b) => b.lastData - a.lastData);
  
      setChatUser(chatsOrdenados);
      setChatUserOriginal(chatsOrdenados);
    } catch (error) {
    }
  };

  const search = (value) => {
    let lista = JSON.parse(JSON.stringify(chatUserOriginal));
    setChatUser(lista.filter((chat) => chat.nome.toLowerCase().includes(value.toLowerCase())));
  }

  useLayoutEffect(() => {
    const requestUser = async () => {
      try {
        const imageUrl = await getImageFromFirebase(`${user.email}-perfil`);
        setImage(imageUrl);
      } catch (error) {
        
      }
    };

    requestUser();
  }, [])

  useEffect(() => {
    buscarChat();
  }, [chatUser.newMessage,chatUser.lastSender]);

  return (
    <View style={styles.container}>
      <View style={styles.grayBlock}>
        <Text style={styles.titulo}>Mensagens</Text>
        <Divider color='#95909f' width={2} style={{marginTop: 10, marginBottom: 10}}/>
        <View style={styles.PerfilImage}>
          <View style={styles.imageContainer}>
            {image != "" ? (
              <Image source={{uri: image}} style={styles.imagem}/>
            ) : (
              <Image source={require("../../../assets/userIcon.png")} style={styles.imagem}/>
            )}
          </View>
          <View style={styles.linha}>
            <Input placeholder="Busque aqui" style={styles.Input}
            leftIcon={{ type: 'FontAwesome5', name: 'search', marginTop: 10 }}
            autoCapitalize="none"
            maxLength={35}
            onChangeText={(value) => search(value)}
            />
          </View>
        </View>
        <Divider color='#95909f' width={2} style={{marginTop: 10, marginBottom: 10}}/>
        <FlatList data={chatUser} 
          renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('PrivateChatPage', { dados: item })}>
                  <RegistroChat dados={item}/>
              </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text>Não há nenhuma conversa!</Text>
            </View>
          )}
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
  grayBlock: {
    width: '90%',
    height: '95%',
    backgroundColor: '#e6ecff',
    margin: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C2C2C2',
  },
  titulo: {
    fontFamily: 'serif',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 5,
  },
  PerfilImage: {
    flexDirection: 'row',
  },
  imageContainer: {
    alignItems: 'flex-start'
  },
  imagem: {
    width: 70,
    height: 70,
    borderRadius: 100,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  linha: {
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
    height: 50,
    width: '75%',
    alignItems: 'center',
  },
  Input: {
    flex: 1,
    marginLeft: 15,
    marginTop: 10,
    color: '#000',
  },
  emptyContainer: {
    width: '80%',
    marginTop: 10,
    marginLeft: 10,
  },
});
