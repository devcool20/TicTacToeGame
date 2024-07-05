import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Sound from 'react-native-sound';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handlePress = (index: number) => {
    if (board[index] || calculateWinner(board)) {
      return;
    }
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const calculateWinner = (squares: Array<string | null>) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const renderSquare = (index: number) => {
    return (
      <TouchableOpacity style={styles.square} onPress={() => handlePress(index)}>
        <Text style={styles.squareText}>{board[index]}</Text>
      </TouchableOpacity>
    );
  };

  const playWinnerSound = () => {
    var winnerSound = new Sound('winner.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      winnerSound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  };

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
    setTimeout(() => {
      setAlertMessage(`Winner: ${winner}`);
      setModalVisible(true);
      playWinnerSound();
    }, 100);
  } else if (board.every(square => square !== null)) {
    status = 'Draw!';
    setTimeout(() => {
      setAlertMessage('Draw!');
      setModalVisible(true);
    }, 100);
  } else {
    status = `Next player: ${isXNext ? 'X' : 'O'}`;
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.board}>
        {board.map((_, index) => renderSquare(index))}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={resetGame}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  board: {
    width: '80%',
    height: '50%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  square: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  squareText: {
    fontSize: 32,
  },
  status: {
    fontSize: 22,
    marginBottom: 20,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#82589F',
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default TicTacToe;
