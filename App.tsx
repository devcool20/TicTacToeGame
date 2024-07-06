import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlayerSelectionScreen from './PlayerSelectionScreen';
import TicTacToe from './TicTacToe';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PlayerSelection">
        <Stack.Screen name="PlayerSelection" component={PlayerSelectionScreen} />
        <Stack.Screen name="Game" component={TicTacToe} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

