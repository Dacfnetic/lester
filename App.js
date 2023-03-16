import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, Pressable, Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [escena1, setEscena1] = useState(true);
  const [escena2, setEscena2] = useState(false);
  const [escena3, setEscena3] = useState(false);
  const [codigo, setCodigo] = useState(2);
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  const toggleMainView = (esc) => {
    setEscena1(false);
    setEscena2(false);
    setEscena3(false);
    switch (esc) {
      case 'Regresar':
        setEscena1(true);
        break;
      case 'Registrar':
        setEscena2(true);
        break;
      case 'Vender':
        setEscena3(true);
        break;
      default:
        console.log(`Sorry, we are out of ${esc}.`);
    }
  }
  

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log (type);
    console.log (data);
    Alert.alert('Aviso', `Bar code with type ${type} and data ${data} has been scanned!`, [
      {
        text: '',
        onPress: handleFollowCode,
      },
    ]);
  }
  const handleBarCodeScannedR = ({ type, data }) => {
    setScanned(true);
    console.log (type);
    console.log (data);
    if(type == "org.iso.QRCode"){
      setCodigo(data);
      // Ahora aquí tengo que cambiar el nombre si es que existe en la base de datos

      //------------------------------------------------------
      Alert.alert('Aviso', `Datos sobrescritos en formulario`, [
        {
          text: '',
          onPress: handleFollowCode,
        },
      ]);
    }
    if(type == "org.gs1.EAN-13"){
      Alert.alert('Aviso', `Datos sobrescritos en formulario`, [
        {
          text: '',
          onPress: handleFollowCode,
        },
      ]);
    }
    
  }
  const handleFollowCode = () => {
    setScanned(false);
  }

  const handleSubmit = () => {
    fetch('http://192.168.0.12:3000/ingresar',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          code: codigo,
      })
    })
    .then(response => response.json())
    .then(user => {
        /*if(user.id){
            this.props.loadUser(user);
            this.props.onRouteChange('home');
        }*/
    })
    .catch(err => alert(err))
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View style={styles.container}>
    {escena1 
    ?
      <View style={styles.buttons}>
        <Pressable
            style={styles.button}
            onPress={() => toggleMainView("Registrar")}>
            <Text style={styles.text}>Registrar</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => toggleMainView("Vender")}>
            <Text style={styles.text}>Vender</Text>
          </Pressable>
      </View>
    : 
      null
    }
    {escena2 
    ? 
        <View style={styles.register}>
          <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
            <View style={styles.scanner}>
              <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScannedR}
              style={StyleSheet.absoluteFillObject}
              />
            </View>
            <ScrollView style={styles.scrollView}>
              <TextInput
                placeholder='código'
                editable={false}
                value={codigo}
                style={styles.input}
              >
              </TextInput>
              <TextInput
                placeholder='nombre'
                style={styles.input}
              >
              </TextInput>
              <TextInput
                keyboardType='decimal-pad'
                placeholder='precio de compra'
                style={styles.input}
              >
              </TextInput>
              <TextInput
                keyboardType='decimal-pad'
                placeholder='precio de venta'
                style={styles.input}
              >
              </TextInput>
              <TextInput
                keyboardType='decimal-pad'
                placeholder='precio de rebaja'
                style={styles.input}
              >
              </TextInput>
              <TextInput
                keyboardType='number-pad'
                placeholder='día de vencimiento'
                style={styles.input}
              >
              </TextInput>
              <TextInput
                keyboardType='number-pad'
                placeholder='mes de vencimiento'
                style={styles.input}
              >
              </TextInput>
              <TextInput
                keyboardType='number-pad'
                placeholder='año de vencimiento'
                style={styles.input}
              >
              </TextInput>
            </ScrollView>
            <View style={styles.two}>
              <Pressable
                style={styles.button}
                onPress={() => toggleMainView("Regresar")}>
                <Text style={styles.text}>Regresar</Text>
              </Pressable>
              <Pressable
                style={styles.button2}
                onPress={handleSubmit}>
                <Text style={styles.text}>Registrar</Text>
              </Pressable>
            </View>
            
          </KeyboardAvoidingView>
        </View>
    : 
      null
    }
    {escena3
    ?
        <View style={styles.buttons}>
          <Pressable
            style={styles.button}
            onPress={() => toggleMainView("Regresar")}>
            <Text style={styles.text}>Regresar V</Text>
          </Pressable>
      </View>
    : 
      null
    }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  register: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 50,
  },
  scanner: {
    flex: 1,
    maxHeight: 200,
  },
  input: {
    borderWidth: 2,
    borderColor: 'skyblue', 
    marginHorizontal: 20,
    marginVertical: 10,
    fontSize: 25,
  },
  buttons: {
    flex: 1,
    marginVertical: 256,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  two: {
    marginVertical: 0,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'green',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
