import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Main from './Screens/Main';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import Profile from './Screens/Profile';
import Black from './Screens/Black';
import Headlines from './Screens/Tabs/Headlines';
import News from './Screens/Tabs/News';
import NewsDetail from './Screens/NewsDetails';


const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Headlines' component={Headlines} />
      <Tab.Screen name='News' component={News} />
    </Tab.Navigator>
  );
}

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return <ActivityIndicator />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
                <Stack.Screen
                  name="Main"
                  component={Main}
                  options={{ headerShown: false }}
                />
              <Stack.Screen
                name="Profile"
                component={Black}
                options={{
                  headerShown: true,
                  headerBackground: Profile,
                }}
              />
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }} 
            />
              <Stack.Screen
              name='NewsDetails'
              component={NewsDetail}
              options={{
                headerShown: true,
                headerTintColor:'#ffffff',
                headerPressColor:'#fff',
                headerTitle:'D E T A I L S',
                headerStyle:{backgroundColor:'#00863D', borderBottomLeftRadius:20,borderBottomRightRadius:20},
              }}
              />
          </>
        ) : (
          <>
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
