import React, { useState, useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, RefreshControl, FlatList, Linking, useColorScheme, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Headlines from './Tabs/Headlines';
import News from './Tabs/News';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';

type RootStackParamList = {
  Profile: undefined;
};

type ProfileNavigationProp = StackNavigationProp<RootStackParamList>;

const Tab = createMaterialTopTabNavigator();
const Main: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const navigation = useNavigation<ProfileNavigationProp>();

    const fetchUserData = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setCurrentImage(data?.Photo);
        }
      }
    };
    fetchUserData();

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleProfile = () => {
    navigation.navigate('Profile');
  }
  const onRefresh = async () => {
    await fetchUserData();
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle={colorScheme === 'light' ? 'dark-content' : 'dark-content'} />
      <Image source={require('../image.png')} style={styles.backgroundImage} />

      <View style={styles.header}>
        <Text style={styles.headerText}>NewsActive</Text>
        <TouchableOpacity onPress={onRefresh} style={{start: 75}}>
          <Icon name='refresh' size={25} color={'black'} style={{backgroundColor:'transparent'}}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileBtn} onPress={handleProfile}>
          {currentImage ? (
            <Image source={{ uri: currentImage }} style={styles.profileImg} />
          ) : (
            <Icon name='person' size={20} color={'white'} />
          )}
        </TouchableOpacity>
      </View>
      
      <Tab.Navigator
        style={{ top: 90 }}
        screenOptions={{
          tabBarStyle: {
            elevation: 0,
            backgroundColor:'transparent',
          },
          tabBarActiveTintColor: '#00662e',
          tabBarInactiveTintColor: '#00b350',
          tabBarPressColor:'#e6fff1',
          tabBarIndicatorStyle:{backgroundColor:'#00863d', borderWidth:0, elevation:5, shadowColor:'#00863d'},
        }}
        >
      <Tab.Screen
        name="H E A D L I N E S"
        component={Headlines}
        />
      <Tab.Screen
        name="N E W S"
        component={News}
        />
    </Tab.Navigator>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#00863D',
    letterSpacing: 1,
  },
  profileBtn: {
    backgroundColor: '#00863d',
    borderRadius: 50,
    padding: 5,
  },
  profileImg: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '15%',
    resizeMode: 'cover',
  },
  newsItem: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  image: {
    height: 100,
    width: '100%',
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    marginVertical: 5,
  },
  readMoreButton: {
    backgroundColor: '#00863D',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  readMoreText: {
    color: 'white',
    fontWeight: '600',
  },
  author: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  publishDate: {
    fontSize: 10,
    color: 'gray',
  },
});
