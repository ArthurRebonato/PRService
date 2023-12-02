import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import * as ContratoServicoService from '../../services/ContratoServicoService'
import * as UserService from '../../services/UserService'

import RegistroNotification from '../../components/RegistroNotification';

export default function NotificationPage(props) {
  const user = useSelector(store => store.user)

  const { navigation } = props;

  const [pedidos, setPedidos] = useState([]);

  const buscarPedidosServico = async () => {
    try {
      const uidUsuario = await UserService.getUserUid(user.uid);
      let dados = await ContratoServicoService.getContratoServicoByuidPrestador(uidUsuario[0]?.uid, false);

      let pedidos = [];
  
      for (const contrato of dados) {
        const dadosUser = await UserService.getUserUid(contrato.uidContratante);
        if (dadosUser.length > 0) {
          pedidos.push(dadosUser[0]);
        }
      }
  
      setPedidos(pedidos);
    } catch (error) {

    }
  }

  useEffect(() => {
    const requestUser = async () => {
      try {
        buscarPedidosServico();
      } catch (error) {
        
      }
    };

    requestUser();
  }, [{ navigation }])

  return (
    <View style={styles.container}>
      <FlatList data={pedidos}
        renderItem={({ item }) => (
          <RegistroNotification dados={item} userLogado={user.uid}/>
        )}
        keyExtractor={item => item.key}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>Não há nenhuma notificação!</Text>
          </View>
        )}
      />

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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});
