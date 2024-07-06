import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  PlayerSelection: undefined;
  Game: { player: 'X' | 'O' };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlayerSelection'>;

const PlayerSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const selectPlayer = (player: 'X' | 'O') => {
    navigation.navigate('Game', { player });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Player</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => selectPlayer('X')}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => selectPlayer('O')}>
          <Text style={styles.buttonText}>O</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D6A2E8',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    margin: 10,
    padding: 20,
    backgroundColor: '#82589F',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default PlayerSelectionScreen;
