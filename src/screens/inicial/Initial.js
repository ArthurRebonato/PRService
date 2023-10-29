import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image} from 'react-native';
import { Button } from '@rneui/themed';

export default function Initial(props) {
    const {navigation} = props

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/logo.png")}
        />
      </View>
      <View style={styles.button}>
        <Button title="Cadastre-se"
            buttonStyle={{
                borderWidth: 2,
                borderColor: '#3498DB',
                borderRadius: 30,
            }}
            onPress={() => navigation.replace("CadastroUser")}
        />
      </View>
      <View style={styles.button}>
        <Button title="Login" type="outline" 
            buttonStyle={{
                borderWidth: 2,
                borderColor: '#3498DB',
                borderRadius: 30,
            }}
            onPress={() => navigation.replace("LoginUser")}
        />
      </View>
        
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginBottom: 76,
  },
  button: {
    marginTop: 10, 
    marginBottom: 10, 
    width: '90%',
  },
});
