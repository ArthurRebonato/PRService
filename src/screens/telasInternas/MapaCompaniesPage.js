import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location'
import MapView, { Marker } from 'react-native-maps'

export default function MapaCompaniesPage(props) {
  const route = useRoute();

  const { navigation } = props;

  const [companies, setCompanies] = useState([]);
  const [myCompany, setMyCompany] = useState({ lat: -28.2652821, lng: -52.421083 });
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
    setCompanies(dados);

    const passedMyCompany = route.params?.myCompany;
    if (passedMyCompany && (passedMyCompany.lat !== myCompany.lat || passedMyCompany.lng !== myCompany.lng)) {
      setMyCompany(passedMyCompany);
    } else {
      myPosition();
    }
  }, [])

  useEffect(() => {
    if (!userLocation) {
      myPosition();
    }
  }, [userLocation]);

  const mapRegion = myCompany.lat === -28.2652821 && myCompany.lng === -52.421083
    ? {
      latitude: userLocation?.latitude || -28.2652821,
      longitude: userLocation?.longitude || -52.421083,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    : {
      latitude: myCompany.lat,
      longitude: myCompany.lng,
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

        {companies.map((company, key) => <Marker
          key={key}
          coordinate={{ latitude: company.lat, longitude: company.lng }}
          title={company.nome}
          icon={require("../../../assets/empresasLocation.png")}
          onPress={() => Alert.alert(company.nome, `Atuação: ${company.atuacao}\nDescrição: ${company.descricao}\nEmpregados: ${company.empregados}\nSite: ${company.site}`)}
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
