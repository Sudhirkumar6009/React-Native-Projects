import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useColorScheme } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Main: undefined; 
};

type StackNavigationProp2 = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: StackNavigationProp2;
}

const SignUp:React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();

  const handleSignUp = async () => {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'User account created!');
  };
  
  const movehandleLogin = () => {
    navigation.navigate('Login');
  };
  

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle={colorScheme === 'light' ? 'dark-content' : 'dark-content'}/>
      <Image
        source={require('../image.png')}
        style={styles.backgroundImage}
      />
      <Text style={styles.header}>CREATE ACCOUNT</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={{margin:20,padding:20,borderRadius:10,backgroundColor:'#C1FF61',alignItems:'center'}} onPress={handleSignUp}>
        <Text style={{color:'black',letterSpacing:1,fontSize:20,}}>CREATE</Text>
      </TouchableOpacity>
      <Text style={{alignSelf:'center',fontSize:20, marginTop:20}}>Already have an Account ?</Text>
      <TouchableOpacity style={{width:'50%',padding:10,alignSelf:'center',borderRadius:10,backgroundColor:'#fff',alignItems:'center',borderColor:'#C1FF61', borderWidth:1,margin:10,elevation:10,shadowColor:'#C1FF61'}} onPress={movehandleLogin}>
        <Text style={{color:'black',letterSpacing:1,fontSize:20,}}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: 100,
    resizeMode: 'stretch', 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: 'black',
  },
  input: {
    borderColor: '#5c9900',
    elevation:10,
    borderWidth:0.7,
    borderRadius:10,
    padding:20,
    paddingStart:20,
    fontSize:18,
    shadowColor:'#C1FF61',
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white', 
    margin:20,
  },
});