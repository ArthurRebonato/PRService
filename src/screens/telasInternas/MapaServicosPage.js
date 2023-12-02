import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location'
import MapView, { Marker } from 'react-native-maps'

export default function MapaServicosPage(props) {
  const route = useRoute();

  const { navigation } = props;
  
  const [servicos, setServicos] = useState([]);
  const [myServico, setMyServico] = useState({ lat: -28.2652821, lng: -52.421083 });
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
    setServicos(dados);

    const passedMyServico = route.params?.myServico;
    if (passedMyServico && (passedMyServico.lat !== myServico.lat || passedMyServico.lng !== myServico.lng)) {
      setMyServico(passedMyServico);
    } else {
      myPosition();
    }
  }, [])

  useEffect(() => {
    if (!userLocation) {
      myPosition();
    }
  }, [userLocation]);

  const mapRegion = myServico.lat === -28.2652821 && myServico.lng === -52.421083
    ? {
      latitude: userLocation?.latitude || -28.2652821,
      longitude: userLocation?.longitude || -52.421083,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    : {
      latitude: myServico.lat,
      longitude: myServico.lng,
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

        {servicos.map((servico, key) => <Marker
          key={key}
          coordinate={{ latitude: servico.lat, longitude: servico.lng }}
          title={servico.nome}
          icon={require("../../../assets/servicosLocation.png")}
          onPress={() => Alert.alert(servico.nome, `Atuação: ${servico.atuacao}\nRegião: ${servico.regiao}\nEndereço: ${servico.rua}\nDescrição: ${servico.descricao}`)}
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
