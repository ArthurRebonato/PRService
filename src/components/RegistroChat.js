import { StyleSheet, View, Text, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getImageFromFirebase } from '../services/ImagemService';

export default function RegistroChat(props) {
    const user = useSelector(store => store.user);

    const data = props.dados

    const [image, setImage] = useState("");

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const email = data.email;
                const imageUrl = await getImageFromFirebase(`${email}-perfil`);
                setImage(imageUrl);
            } catch (error) {

            }
        };

        fetchImage();
    }, [props]);

  return (
    <View style={styles.container}>
      <View style={styles.perfil}>
        <View style={styles.imageContainer}>
            {image != "" ? (
                <Image source={{uri: image}} style={styles.imagem}/>
            ) : (
                <Image source={require("../../assets/userIcon.png")} style={styles.imagem}/>
            )}
        </View>
        <View>
            <View style={styles.linha}>
                <Text style={styles.textTitulo}>{data.nome}</Text>
                {data.newMessage && user.uid !== data.lastSender ? (
                    <View style={styles.newMessageIndicator}>
                        <Text style={{fontSize: 12, color: '#fff'}}>New</Text>
                    </View>
                ) : null}
            </View>
            <View style={{marginTop: 5, marginLeft: 10}}>
                <Text style={{fontSize: 12, color: '#6A6A6A', width: '70%'}}>
                    {data.lastMessage.length > 25
                    ? `${data.lastMessage.substring(0, 25)} ...`
                    : data.lastMessage
                    }
                </Text>
            </View>
        </View>
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 20,
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
    }, 
    perfil: {
        flexDirection: 'row',
        height: '100',
        marginTop: 10,
        marginBottom: 10,
    },
    imageContainer: {
        marginRight: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    imagem: {
        width: 70,
        height: 70,
        borderRadius: 60,
        marginLeft: 5,
        borderWidth: 1,
        borderColor: "#000",
    },
    linha: {
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 10,
    },
    textTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        width: '70%',
    },
    newMessageIndicator: {
        width: 40,
        height: 20,
        backgroundColor: 'red',
        borderRadius: 10,
        marginLeft: 5,
        alignItems: 'center',
        marginTop: -10,
    },
})