import { StyleSheet, View, Text, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import * as CompanyService from '../services/CompanyService';
import { getImageFromFirebase } from '../services/ImagemService';

export default function RegistroVagas(props) {
    const data = props.dados;
    const tipo = props.tipo;

    const [myCompany, setMyCompany] = useState({});

    const [image, setImage] = useState("");

    useEffect(() => {
        const fetchImage = async () => {
            try {
                let dados = await CompanyService.getCompanyByDocumentUID(data.uid);
                setMyCompany(dados);

                const imageUrl = await getImageFromFirebase(`${dados.email}-perfilCompany`);
                setImage(imageUrl);
            } catch (error) {

            }
        };

        fetchImage();
    }, [props]);

    return (
        <View>
            {tipo ? (
                <View style={styles.container}>
                    <View style={styles.perfil}>
                        <View style={styles.imageContainer}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.imagem} />
                            ) : (
                                <Image source={require("../../assets/userIcon.png")} style={styles.imagem} />
                            )}
                        </View>
                        <View>
                            <View style={styles.linha}>
                                {myCompany && myCompany.nome && (
                                    <Text style={[styles.textTitulo, { fontSize: Math.max(24 - Math.floor(myCompany.nome.length / 9) * 3), width: 115, marginRight: 10 }]}>
                                        {myCompany.nome}
                                    </Text>
                                )}
                                {data.premium ? (
                                    <MaterialIcons name="verified" size={20} color={"#008BFF"} style={styles.icone} />
                                ) : (
                                    <></>
                                )}
                            </View>
                        </View>
                    </View>
                    <View>
                    </View>
                    <View style={styles.rating}>
                        <View style={[styles.textContainer, { marginBottom: 10 }]}>
                            <Text style={styles.textDados}>{data.nome}</Text>
                            <Text style={styles.textDados}>{data.modo}</Text>
                            <Text style={styles.textDados}>{data.qtdvagas} Vagas</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.textDados, { fontSize: 14, marginBottom: 5 }]}>{data.candidaturas} candidaturas</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.perfil}>
                        <View style={styles.imageContainerAllServicos}>
                            {image != "" ? (
                                <Image source={{uri: image}} style={styles.imagemAllServicos}/>
                            ) : (
                                <Image source={require("../../assets/userIcon.png")} style={styles.imagemAllServicos}/>
                            )}
                        </View>
                        <View >
                            <View style={styles.linha}>
                                {data && data.nome && (
                                    <Text style={[styles.textTitulo, { fontSize: Math.max(24 - Math.floor(data.nome.length / 10) * 2), marginLeft: -15, width: 200}]}>
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
                                    <Text style={styles.textDados}>{data.modo}</Text>
                                </View>
                                <View style={[styles.textContainer, {marginBottom: 5}]}>
                                    <Text style={styles.textDados}>{data.experiencia}</Text>
                                </View>
                                <View style={[styles.textContainer, {marginBottom: 5}]}>
                                    <Text style={styles.textDados}>{data.qtdvagas} Vagas</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.rating, {marginBottom: 5}]}>
                        <View style={[styles.textContainer, {marginTop: 5}]}>
                            <Text style={[styles.textDados, {fontSize: 14, color: '#FC7163'}]}>{data.candidaturas} candidaturas</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 20,
        marginTop: 10,
        marginRight: 10,
    }, 
    perfil: {
        flexDirection: 'row',
        height: '100',
    },
    imageContainer: {
        marginTop: 5,
        marginRight: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    imageContainerAllServicos: {
        marginRight: 20,
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
    imagemAllServicos: {
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
    rating: {
        marginTop: 5,
    },
})