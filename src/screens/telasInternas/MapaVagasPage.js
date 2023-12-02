import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location'
import MapView, { Marker } from 'react-native-maps'

export default function MapaVagasPage(props) {
  const route = useRoute();

  const { navigation } = props;
  
  const [vagas, setVagas] = useState([]);
  const [myVaga, setMyVaga] = useState({ lat: -28.2652821, lng: -52.421083 });
  const [userLocation, setUserLocation] = useState(null);

  const myPosition = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        return;
      }

      let myLocation = await Location.getCurrentPositionAsync({})
      setUserLocation({
        latitude: myLocation.coords.latitude,
        longitude: myLocation.coords.longitude,
      });
    } catch (error) {
      console.error('Erro ao obter a localização:', error);
    }
  };

  useLayoutEffect(() => {
    const dados = route.params?.data;
    setVagas(dados);

    const passedMyVaga = route.params?.myVaga;
    if (passedMyVaga && (passedMyVaga.lat !== myVaga.lat || passedMyVaga.lng !== myVaga.lng)) {
      setMyVaga(passedMyVaga);
    } else {
      myPosition();
    }
  }, [])

  useEffect(() => {
    if (!userLocation) {
      myPosition();
    }
  }, [userLocation]);

  const mapRegion = myVaga.lat === -28.2652821 && myVaga.lng === -52.421083
    ? {
      latitude: userLocation?.latitude || -28.2652821,
      longitude: userLocation?.longitude || -52.421083,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    : {
      latitude: myVaga.lat,
      longitude: myVaga.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

  return (
    <View>
      <MapView style={styles.map} region={mapRegion}>
        {userLocation && <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          }}
          title='Minha posição'
          icon={require("../../../assets/myLocation.png")}
        />
        }

        {vagas.map((vaga, key) => <Marker
          key={key}
          coordinate={{ latitude: vaga.lat, longitude: vaga.lng }}
          title={vaga.nome}
          icon={require("../../../assets/vagasLocation.png")}
          onPress={() => Alert.alert(vaga.nome, `Modo: ${vaga.modo}\nExperiência: ${vaga.experiencia}\nRequisito: ${vaga.requisito}\nQuantidade Vaga: ${vaga.qtdvagas}`)}
        />)}
      </MapView>

      <StatusBar style="light" />
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
})
