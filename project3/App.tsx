import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainTasks from './screens/MainTasks';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTasks">
        <Stack.Screen name="MainTasks" component={MainTasks} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}