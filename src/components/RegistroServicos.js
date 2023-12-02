import { StyleSheet, View, Text, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { AirbnbRating, Button } from '@rneui/themed';

import * as CompanyTalentService from "../services/CompanyTalentService"
import * as CurriculoVagaService from "../services/CurriculoVagaService"
import * as VagasService from "../services/VagasService"

import { getImageFromFirebase } from '../services/ImagemService';

export default function RegistroServicos(props) {
    const data = props.dados;
    const tipo = props.tipo;
    const curriculo = props.curriculo;
    const aprovado = props.aprovado;
    const candidatura = props.candidatura;

    const [image, setImage] = useState("");

    const excluirCurriculo = async() => {
        try {
            if (candidatura == "company") {
                let result = await CompanyTalentService.deleteTalentByUserAndCompanyUID(data.uid, data.uidCompany);
                Alert.alert(result);
            } 

            if (candidatura == "vaga") {
                let result = await CurriculoVagaService.deleteTalentByUserAndCompanyUID(data.uid, data.uidVaga);
                Alert.alert(result);

                const dataCompany = await VagasService.getVagasByDocumentUID(data.uidVaga);
                const createTalent = {aprovado: false, uidCompany: dataCompany.uid, uidUser: data.uid};
                await CompanyTalentService.createCompanyTalent(createTalent);
            }
        } catch (error) {
            
        }
    }

    const atualizarCurriculo = async() => {
        try {
            const updatedForm = {aprovado: true};

            if (candidatura == "company") {
                let result = await CompanyTalentService.updateTalentByUserAndCompanyUID(data.uid, data.uidCompany, updatedForm);
                Alert.alert(result);
            } 
            
            if (candidatura == "vaga") {
                let result = await CurriculoVagaService.updateVagaByUserAndVagaUID(data.uid, data.uidVaga, updatedForm);
                Alert.alert(result);
            }
        } catch (error) {
            
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
                                {data && data.nome && (
                                    <Text style={[styles.textTitulo, { fontSize: Math.max(20 - Math.floor(data.nome.length / 9) * 2), width: 90 }]}>
                                        {data.nome}
                                    </Text>
                                )}
                                <MaterialIcons name="verified" size={20} color={data.premium ? "#008BFF" : "#fff"} style={styles.icone} />
                            </View>
                        </View>
                    </View>
                    <View>
                    </View>
                    <View style={styles.rating}>
                        <View style={[styles.textContainer, { marginBottom: 10 }]}>
                            <Text style={styles.textDados}>{data.atuacao}</Text>
                            <Text style={styles.textDados}>{data.regiao}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.textDados, { fontSize: 14 }]}>{data.avaliacoes} recomendações</Text>
                        </View>
                        <AirbnbRating count={5} defaultRating={data.rating} size={20} showRating={false} isDisabled />
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
                                    <Text style={styles.textDados}>{data.atuacao}</Text>
                                </View>
                                <View style={[styles.textContainer, {marginBottom: 5}]}>
                                    <Text style={styles.textDados}>{data.regiao}</Text>
                                </View>
                                <View style={[styles.textContainer, {marginBottom: 5}]}>
                                    <Text style={styles.textDados}>{data.descricao}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {curriculo ? ( 
                        <View style={{flexDirection: 'row', justifyContent: 'center', padding: 5}}>
                            <View style={[aprovado ? null : {marginRight: 20}]}>
                                <Button radius={"xl"} type="solid" color={'#ff0000'} onPress={() => excluirCurriculo()}>
                                    <AntDesign name="close" size={24} color="white" />
                                </Button>
                            </View>
                            {aprovado ? (
                                <></>
                            ) : (
                                <View style={{marginLeft: 20}}>
                                    <Button radius={"xl"} type="solid" color={'#47D013'} onPress={() => atualizarCurriculo()}>
                                        <AntDesign name="check" size={24} color="white" />
                                    </Button>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={[styles.rating, {marginBottom: 5}]}>
                            <View style={[styles.textContainer, {marginTop: 5}]}>
                                <Text style={[styles.textDados, {fontSize: 14, color: '#FC7163'}]}>{data.avaliacoes} recomendações</Text>
                            </View>
                            <AirbnbRating count={5} defaultRating={data.rating} size={30} showRating={false} isDisabled />
                        </View>
                    )}
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