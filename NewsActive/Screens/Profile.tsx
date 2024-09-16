import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, View, Alert, Image, TextInput, Text, useColorScheme, TouchableOpacity, StatusBar, Platform, Linking } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = ({ navigation }: any) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [about, setAbout] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentSurname, setCurrentSurname] = useState('');
  const [currentAbout, setCurrentAbout] = useState('');
  const [usernameEditable, setUsernameEditable] = useState(false);
  const [surnameEditable, setSurnameEditable] = useState(false);
  const [aboutEditable, setAboutEditable] = useState(false);
  const colorScheme = useColorScheme();
  const [error, setError] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth().currentUser;

      if (user) {
        const uid = user.uid;
        try {
          const userDoc = await firestore().collection('users').doc(uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setCurrentUsername(data?.Username || '');
            setCurrentSurname(data?.Surname || '');
            setCurrentAbout(data?.About || '');
            setCurrentImage(data?.Photo || '');

            setUsername(data?.Username || '');
            setSurname(data?.Surname || '');
            setAbout(data?.About || '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    
    fetchUserData();
  }, []);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUserEmail(user.email);
    } else {
      console.log('No user is currently logged in');
    }
  }, []);



  const handleUpdate = async () => {
    if (!username && !usernameEditable) {
      Alert.alert('Error', 'Username is required.');
      return;
    }
    if (!surname && !surnameEditable) {
      Alert.alert('Error', 'Surname is required.');
      return;
    }
    if (!about && !aboutEditable) {
      Alert.alert('Error', 'About section is required.');
      return;
    }
    if (!imageUri && !aboutEditable) {
      Alert.alert('Error', 'About section is required.');
      return;
    }
    const user = auth().currentUser;

    if (user) {
      const uid = user.uid;
      try {
        await firestore().collection('users').doc(uid).set({
          Username: username || currentUsername,
          Photo: imageUri,
          Surname: surname || currentSurname,
          About: about || currentAbout,
        }, { merge: true }); 

        setCurrentUsername(username || currentUsername);
        setCurrentSurname(surname || currentSurname);
        setCurrentAbout(about || currentAbout);
        setCurrentImage(imageUri);
        setIsEditModalVisible(false);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  const handleSelectImage = async (source: 'camera' | 'library') => {
    
    if (source === 'camera') {
      const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
      if (cameraPermission === RESULTS.GRANTED) {
        launchCamera({ mediaType: 'mixed' }, (response) => {
          if (response.didCancel) {
            Alert.alert('User cancelled image picker');
          } else if (response.errorCode) {
            Alert.alert('ImagePicker Error: ', response.errorMessage);
          } else {
            const uri = response.assets?.[0]?.uri;
            if (uri) {
              setImageUri(uri);
              setIsModalVisible(false);
            } else {
              Alert.alert('No image selected');
            }
          }
        });
      } else {
        Alert.alert('Camera permission is required');
        const cameraPermissioAccess = await request(PERMISSIONS.ANDROID.CAMERA);
        if (cameraPermissioAccess === RESULTS.GRANTED) {
          console.log("Camara Permission Granted !");
        }
      }
    } else if (source === 'library') {
      const mediaLibraryPermission = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      const mediaLibraryPermission2 = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      if (mediaLibraryPermission || mediaLibraryPermission2 === RESULTS.GRANTED) {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
          if (response.didCancel) {
            Alert.alert('User cancelled image picker');
          } else if (response.errorCode) {
            Alert.alert('ImagePicker Error: ', response.errorMessage);
          } else {
            const uri = response.assets?.[0]?.uri;
            if (uri) {
              setImageUri(uri);
              setIsModalVisible(false); 
            } else {
              Alert.alert('No image selected');
            }
          }
        });
      } else {
        Alert.alert('Media library permission is required');
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: () => setError('') }]);
    }
  }, [error]);

  const logOut = async () => {
    try {
      await auth().signOut();
      setUserLoggedIn(false);
    } catch (err: any) {
      Alert.alert('Error', err.message, [{ text: 'OK', onPress: () => setError(err.message) }]);
    }
  };

  const sureToLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel' },
        { text: 'OK', onPress: () => logOut() },
      ],
      { cancelable: false }
    );
  };

  const githubHandle = () => {
    Linking.openURL('https://github.com/Sudhirkumar6009')
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)} style={{justifyContent:'flex-end'}}>
        <View style={styles.modalContentPickImg}>
          <TouchableOpacity style={{padding:15,borderRadius:10,elevation:10,borderWidth:0.5,backgroundColor:'white',borderColor:'white',shadowColor:'#00cc00',flex:1,height:100,margin:15,alignItems:'center',justifyContent:'center'}} onPress={() => handleSelectImage('camera')}>
            <Icon name='camera-alt' size={35} color={'#00cc00'} />
          </TouchableOpacity>
          <TouchableOpacity style={{padding:15,borderRadius:10,elevation:10,borderWidth:0.5,backgroundColor:'white',borderColor:'white',shadowColor:'#00cc00',flex:1,height:100,margin:15,alignItems:'center',justifyContent:'center'}} onPress={() => handleSelectImage('library')}>
            <Icon name='photo-library' size={35} color={'#00cc00'} />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isEditModalVisible} onBackdropPress={() => setIsEditModalVisible(false)}>
        <View style={styles.modalContentEdit}>
          <View style={{ flexDirection: 'row', backgroundColor: "#fff", alignItems: 'center' }}>
            {currentImage ? (
              <Image source={{ uri: currentImage }} style={colorScheme === 'dark' ? styles.imageEditDark : styles.imageEditLight} />
            ) : (
              <Image source={require('../image.png')} style={colorScheme === 'dark' ? styles.imageEditDark : styles.imageEditLight} />
            )}
            {imageUri && (
              <>
                <Icon name='double-arrow' size={35} color='black' style={{ marginHorizontal: 10 }} />
                <Image source={{ uri: imageUri }} style={colorScheme === 'dark' ? styles.imageEditDark : styles.imageEditLight} />
              </>
            )}
          </View>
          
      <TouchableOpacity style={{width:'50%',padding:10,alignSelf:'center',borderRadius:10,backgroundColor:'#fff',alignItems:'center',borderColor:'#C1FF61', borderWidth:1,elevation:10,shadowColor:'#C1FF61'}} onPress={() => setIsModalVisible(true)}>
        <Text style={{color:'black',letterSpacing:1,fontSize:17,}}>EDIT PHOTO</Text>
      </TouchableOpacity>
          <View style={{ flexDirection: 'row', margin: 20 }}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder={currentUsername}
              editable={usernameEditable}
            />
            <TouchableOpacity onPress={() => setUsernameEditable(!usernameEditable)}>
              <Icon name='edit' size={30} style={{marginTop:10}}/>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', margin: 20 }}>
            <TextInput
              style={styles.input}
              value={surname}
              onChangeText={setSurname}
              placeholder={currentSurname}
              editable={surnameEditable}
            />
            <TouchableOpacity onPress={() => setSurnameEditable(!surnameEditable)}>
              <Icon name='edit' size={30} style={{marginTop:10}} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', margin: 20 }}>
            <TextInput
              style={styles.input}
              value={about}
              onChangeText={setAbout}
              placeholder={currentAbout}
              editable={aboutEditable}
            />
            <TouchableOpacity onPress={() => setAboutEditable(!aboutEditable)}>
              <Icon name='edit' size={30} style={{marginTop:10}}/>
            </TouchableOpacity>
          </View>

      <TouchableOpacity style={{padding:15,borderRadius:10,backgroundColor:'#00cc00',alignItems:'center',width:'100%',marginTop:10}} onPress={handleUpdate}>
        <Text style={{color:'white',letterSpacing:1,fontSize:18,}}>DONE</Text>
      </TouchableOpacity>
        </View>
      </Modal>
      <StatusBar translucent backgroundColor="transparent" barStyle={colorScheme === 'light' ? 'dark-content' : 'dark-content'}/>
      <Image
        source={require('../image.png')}
        style={styles.backgroundImage}
      />
      <TouchableOpacity
          style={{ backgroundColor: 'red', alignItems: 'center',alignSelf:'flex-end',margin:20, padding: 10,width:'30%', borderRadius:10}}
          onPress={sureToLogout}
        >
          <View style={{flexDirection:'row'}}>
            <Icon name='logout' size={20} color={'white'} style={{marginEnd:10}}/>
            <Text style={{color: 'white', fontSize:15, letterSpacing:1.5,}}>LOGOUT</Text>
          </View>
        </TouchableOpacity>
      {currentImage ? (
          <Image source={{ uri: currentImage }} style={colorScheme === 'dark' ? styles.imageDark : styles.imageLight} />
      ) : (
        <Image source={require('../image.png')} style={colorScheme === 'dark' ? styles.imageDark : styles.imageLight} />
      )}

      <View style={{ flexDirection: 'row', borderColor: 'black', margin: 20 }}>
        <Icon name='person' style={{ margin: 15, color: 'black', borderRadius: 50 }} size={20} />
        <View style={{ flexDirection: 'column' }}>
          <Text style={colorScheme === 'dark' ? styles.nameTxtDark : styles.nameTxtLight}>Name: </Text>
          <Text style={styles.username}>{currentUsername || 'Edit name'} {currentSurname || ''}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', borderColor: 'black', margin: 20 }}>
        <Icon name='info' style={{ margin: 10, borderRadius: 50, color: 'black' }} size={23} />
        <View style={{ flexDirection: 'column' }}>
          <Text style={colorScheme === 'dark' ? styles.nameTxtDark : styles.nameTxtLight}>About: </Text>
          <Text style={styles.username}>{currentAbout || 'Write something about yourself.'}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', borderColor: 'black', margin: 20 }}>
        <Icon name='mail' style={{ margin: 15, borderRadius: 50, color: 'black' }} size={23} />
        <View style={{ flexDirection: 'column' }}>
          <Text style={colorScheme === 'dark' ? styles.nameTxtDark : styles.nameTxtLight}>Email: </Text>
          <Text style={styles.username}>{userEmail}</Text>
        </View>
      </View>
      <View style={{height:25}}/>
      <TouchableOpacity onPress={() => setIsEditModalVisible(true)} style={colorScheme === 'dark' ? styles.editBtnDark : styles.editBtnLight}>
        <View style={{flexDirection:'row'}}>
          <Icon name='edit' size={25} color={'black'} style={{marginEnd:10}}/>
          <Text style={colorScheme === 'dark' ? styles.editProfileDark : styles.editProfileLight}>EDIT PROFILE</Text>
        </View>
      </TouchableOpacity>
      <View style={{alignItems:'flex-end',margin:10}}>
      <Text style={{color:'black'}}>Created by</Text>
      <TouchableOpacity onPress={githubHandle}><Text style={{color:'black', fontWeight:'800'}}>Sudhirkumar Kuchara <Icon2 name='external-link' size={13} color={'black'} style={{top:3}}/></Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
  },
  imageLight: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 100,
    resizeMode: 'cover',
  },
  imageDark: {
    width: 100,
    height: 100,
    borderRadius: 100,
    resizeMode: 'cover',
    marginTop: 10,
  },
  modalContentPickImg: {
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection:'row',
    alignContent:'center',
    justifyContent:'center',
  },
  modalContentEdit: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 60,
    borderBottomWidth: 1,
    width: 200,
    fontSize: 20,
    borderBottomColor: 'grey',
    marginBottom: 0,
    paddingHorizontal: 8,
  },
  username: {
    fontSize: 18,
    color: 'black',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: 'green',
  },
  nameTxtLight: {
    marginTop: 0,
    marginBottom: 5,
    marginEnd: 20,
  },
  nameTxtDark: {},
  editBtnLight: {
    backgroundColor: '#C1FF61',
    padding: 20,
    borderWidth: 0.4,
    margin:13,
    borderColor: '#d9d9d9',
    borderRadius: 10,
    alignItems: 'center',
    width:'50%',
    alignSelf:'center'
  },
  editBtnDark: {},
  editProfileLight: {
    color: 'black',
    fontSize: 18,
    letterSpacing:1,
    fontWeight:'700'
  },
  editProfileDark: {
    color: 'white',
    fontSize: 18,
  },
  imageEditDark: {},
  imageEditLight: {
    width: 75,
    height: 75,
    elevation:10,
    alignSelf: 'center',
    borderRadius: 100,
    margin: 25,
    resizeMode: 'cover',
  },
  backgroundImage: {
    width: '100%',
    height: 100,
    resizeMode: 'stretch',
  },
});

export default ProfileScreen;
