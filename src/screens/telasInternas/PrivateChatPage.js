import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { Divider } from '@rneui/themed';
import { useRoute } from '@react-navigation/native';

import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import {db} from "../../backend/firebaseConnect";

import * as ChatService from '../../services/ChatService'
import { getImageFromFirebase } from '../../services/ImagemService';

export default function PrivateChatPage(props) {
  const route = useRoute();

  const user = useSelector(store => store.user);

  const [image, setImage] = useState("");

  const [chatUser, setChatUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const { navigation } = props;

  useLayoutEffect(() => {
    const request = async () => {
      try {
        const data = route.params?.dados;
        setChatUser(data);

        const imageUrl = await getImageFromFirebase(`${data.email}-perfil`);
        setImage(imageUrl);
      } catch (error) {

      }
    };

    request();
  }, []);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const data = route.params?.dados;
        setChatUser(data);

        if (user.uid !== data.lastSender){
          const updatedForm = {newMessage: false};
          updateNewMessage(data.key, updatedForm);
        }

        const msgColletionRef = collection(db, `chat/${data.key}/messages`);
        const q = query(msgColletionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (chat) => {
          const newMessages = chat.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMessages(newMessages);

          const latestMessage = newMessages.length > 0 ? newMessages[0] : null;

          updateLastMessage(data.key, latestMessage);
        });

        return unsubscribe;
      } catch (error) {
        
      }
    };

    fetchChatData();
  }, [route.params?.dados]);

  const updateNewMessage = async(chatID, updated) => {
    await ChatService.updateChatByDocumentId(chatID, updated);
  }

  const updateLastMessage = async(chatID, lastMessage) => {
    const updatedForm = {lastMessage: `${lastMessage.message}`, lastSender: `${lastMessage.sender}`, lastData: lastMessage.createdAt};
    await ChatService.updateChatByDocumentId(chatID, updatedForm);
  }

  const sendMessage = async() => {
    const msg = message.trim();
    if (msg.length === 0) return;

    const msgColletionRef = collection(db, `chat/${chatUser.key}/messages`);

    await addDoc(msgColletionRef, {
        message: msg,
        sender: user.uid,
        createdAt: serverTimestamp(),
    })
    setMessage('');

    const updatedForm = {newMessage: true};
    updateNewMessage(chatUser.key, updatedForm);
  }

  const renderMessage = ({item}) => {
    const myMessage = item.sender === user.uid;
    const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    return (
        <View style={[styles.messageContainer, myMessage ? styles.userMessageContainer : styles.otherMessageContainer]}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.time}>{item.createdAt?.toDate().toLocaleString('pt-BR', optionsDate)}</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grayBlock}>
        <View style={styles.PerfilImage}>
          <View style={styles.imageContainer}>
            {image != "" ? (
              <Image source={{uri: image}} style={styles.imagem}/>
            ) : (
              <Image source={require("../../../assets/userIcon.png")} style={styles.imagem}/>
            )}
          </View>
          <View style={styles.linha}>
            <Text style={styles.textTitulo}>{chatUser.nome}</Text>
          </View>
        </View>
        <Divider color='#95909f' width={2} />
        <View style={{flex: 1, marginBottom: 5}}>
            <FlatList data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.key} 
            inverted
            />
        </View>
        <View style={styles.inputContainer}>
            <TextInput multiline value={message} style={styles.messageInput} placeholder='Digite a mensagem'
            onChangeText={(value) => setMessage(value)} />
            <Button disabled={message === ''} title='Enviar' onPress={sendMessage} />
        </View>
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
    margin: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C2C2C2',
  },
  PerfilImage: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  imageContainer: {
    marginRight: 5,
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
    marginRight: 15,
    justifyContent: 'center', 
    paddingBottom: 10, 
    width: '80%'
  },
  textTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  messageInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  messageContainer: {
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessageContainer: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: '#777',
    alignSelf: 'flex-end',
  },
});
