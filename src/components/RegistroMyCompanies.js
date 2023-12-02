import { StyleSheet, View, Text, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { AirbnbRating } from '@rneui/themed';

import { getImageFromFirebase } from '../services/ImagemService';

export default function RegistroMyCompanies(props) {

    const data = props.dados

    const [image, setImage] = useState("");

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const email = data.email;
                const imageUrl = await getImageFromFirebase(`${email}-perfilCompany`);
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
                {data.premium ? (
                    <MaterialIcons name="verified" size={20} color="#008BFF" style={styles.icone} />
                ) : (
                    <></>
                )}
            </View>
            <View style={[data.premium ? null : { marginTop: 15, marginLeft: 15 }]}>
                <View style={styles.textContainer}>
                    <Text style={styles.textDados}>{data.atuacao}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.textDados}>{data.fundacao}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.textDados}>+ de {data.empregados} funcionários</Text>
                </View>
            </View>
        </View>
      </View>
      <View style={styles.rating}>
        <View style={styles.textContainer}>
            <Text style={styles.textDados}>{data.avaliacoes} recomendações</Text>
        </View>
        <AirbnbRating count={5} defaultRating={data.rating} size={30} showRating={false} isDisabled />
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    imageContainer: {
        marginRight: 20,
        alignItems: 'center',
        alignSelf: 'center',
    },
    imagem: {
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
        marginBottom: 5,
    },
    textTitulo: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    textDados: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    icone: {
        marginLeft: 10,
        marginBottom: 10,
    },
    rating: {
        marginTop: 5,
        marginBottom: 10,
    },
})