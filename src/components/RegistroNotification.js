import { StyleSheet, View, Text, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import { serverTimestamp } from 'firebase/firestore';

import { getImageFromFirebase } from '../services/ImagemService';
import * as ContratoServicoService from '../services/ContratoServicoService'
import * as ChatService from '../services/ChatService'

export default function RegistroNotification(props) {
    const data = props.dados;
    const user = props.userLogado;

    const [image, setImage] = useState("");

    const createChatWithUser = async () => {
        try {
            const updatedForm = {user1: `${user}`, user2:`${data.uid}`, newMessage: false, lastMessage: '', lastSender: '', lastData: serverTimestamp()};
            const result = await ChatService.createChat(updatedForm);
            await ContratoServicoService.deletePedidoByUIDs(data.uid, user);
            Alert.alert(result);
        } catch (error) {
            Alert.alert(error);
        }
    }

    const deleteContratoServico = async () => {
        try {
            const result = await ContratoServicoService.deletePedidoByUIDs(data.uid, user);
            Alert.alert(result);
        } catch (error) {
            Alert.alert(error);
        }
    }

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
            <View style={styles.imageContainerAllPedidos}>
                {image != "" ? (
                    <Image source={{uri: image}} style={styles.imagemAllPedidos}/>
                ) : (
                    <Image source={require("../../assets/userIcon.png")} style={styles.imagemAllPedidos}/>
                )}
            </View>
            <View >
                <View style={styles.linha}>
                    {data && data.nome && (
                        <Text style={[styles.textTitulo, { fontSize: Math.max(24 - Math.floor(data.nome.length / 10) * 2), marginLeft: -15, width: 200 }]}>
                            {data.nome}
                        </Text>
                    )}
                    {data.premium ? (
                        <MaterialIcons name="verified" size={20} color="#008BFF" style={styles.icone} />
                    ) : (
                        <></>
                    )}
                </View>
                <View style={[data.premium ? { marginTop: 5, width: 215 } : { marginTop: 5, width: 215 }]}>
                    <View style={[styles.textContainer, {marginBottom: 5}]}>
                        <Text style={styles.textDados}>{data.regiao}</Text>
                    </View>
                    <View style={{marginBottom: 5}}>
                        <Text style={[styles.textDados, {fontWeight: 'bold', fontSize: 18}]}>Enviou uma solicitação de Serviço.</Text>
                    </View>
                </View>
            </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', padding: 5, marginRight: 30}}>
            <View style={[data.status ? null : {marginRight: 5}]}>
                <Button radius={"xl"} type="solid" color={'#ff0000'} onPress={() => deleteContratoServico()}>
                    <AntDesign name="close" size={24} color="white" />
                </Button>
            </View>
            {data.status ? (
                <></>
            ) : (
                <View style={{marginLeft: 20}}>
                    <Button radius={"xl"} type="solid" color={'#47D013'} onPress={() => createChatWithUser()}>
                        <AntDesign name="check" size={24} color="white" />
                    </Button>
                </View>
            )}
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
    }, 
    perfil: {
        flexDirection: 'row',
        height: '100',
    },
    imageContainerAllPedidos: {
        marginRight: 20,
        marginTop: 10,
        alignSelf: 'center',
    },
    imagemAllPedidos: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: "#000",
    },
    linha: {
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 10,
    },
    textContainer: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    textTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textDados: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    icone: {
        marginRight: 10,
        marginBottom: 10,
    },
})