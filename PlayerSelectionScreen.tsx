import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Sound from 'react-native-sound';

type RootStackParamList = {
  PlayerSelection: undefined;
  Game: { player: 'X' | 'O' };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlayerSelection'>;

const PlayerSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const introSoundRef = useRef<Sound | null>(null);

  const selectPlayer = (player: 'X' | 'O') => {
    if (introSoundRef.current) {
      introSoundRef.current.stop(() => {
        introSoundRef.current?.release();
      });
    }
    navigation.navigate('Game', { player });
  };

  useFocusEffect(
    React.useCallback(() => {
      introSoundRef.current = new Sound('intro.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        introSoundRef.current?.setNumberOfLoops(-1);
        introSoundRef.current?.play();
      });

      return () => {
        introSoundRef.current?.stop(() => {
          introSoundRef.current?.release();
        });
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who's gonna make the first move?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => selectPlayer('X')}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
        <View style={styles.bw}>
          <Text>--------------</Text>
        </View>
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
  bw: {
    marginTop: 28,
  },
});

export default PlayerSelectionScreen;
