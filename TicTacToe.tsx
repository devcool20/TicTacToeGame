import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Sound from 'react-native-sound';

type Props = {
  route: {
    params: {
      player: 'X' | 'O';
    };
  };
};

const TicTacToe = ({ route }: Props) => {
  const { player } = route.params;
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(player === 'X');
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (!isXNext && !calculateWinner(board) && !board.every(square => square !== null)) {
      const bestMove = getBestMove(board);
      if (bestMove !== null) {
        handlePress(bestMove);
      }
    }
  }, [isXNext, board]);

  const handlePress = (index: number) => {
    if (board[index] || calculateWinner(board)) {
      return;
    }
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const winner = calculateWinner(newBoard);
    if (winner) {
      setTimeout(() => {
        setAlertMessage(`Winner: ${winner}`);
        setModalVisible(true);
        playWinnerSound();
      }, 100);
    } else if (newBoard.every(square => square !== null)) {
      setTimeout(() => {
        setAlertMessage('Draw!');
        setModalVisible(true);
      }, 100);
    }
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

  const playWinnerSound = () => {
    const winnerSound = new Sound('winner.mp3', Sound.MAIN_BUNDLE, (error) => {
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

  const renderSquare = (index: number) => {
    return (
      <TouchableOpacity style={styles.square} onPress={() => isXNext && handlePress(index)}>
        <Text style={styles.squareText}>{board[index]}</Text>
      </TouchableOpacity>
    );
  };

  const getBestMove = (newBoard: Array<string | null>) => {
    let bestMove = null;
    let bestValue = -Infinity;

    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === null) {
        newBoard[i] = 'O';
        const moveValue = minimax(newBoard, 0, false);
        newBoard[i] = null;

        if (moveValue > bestValue) {
          bestMove = i;
          bestValue = moveValue;
        }
      }
    }
    return bestMove;
  };

  const minimax = (newBoard: Array<string | null>, depth: number, isMaximizing: boolean) => {
    const winner = calculateWinner(newBoard);

    if (winner === 'X') return -10;
    if (winner === 'O') return 10;
    if (newBoard.every(square => square !== null)) return 0;

    if (isMaximizing) {
      let bestValue = -Infinity;

      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = 'O';
          bestValue = Math.max(bestValue, minimax(newBoard, depth + 1, false));
          newBoard[i] = null;
        }
      }
      return bestValue;
    } else {
      let bestValue = Infinity;

      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = 'X';
          bestValue = Math.min(bestValue, minimax(newBoard, depth + 1, true));
          newBoard[i] = null;
        }
      }
      return bestValue;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(player === 'X');
    setModalVisible(false);
  };

  const status = calculateWinner(board)
    ? `Winner: ${calculateWinner(board)}`
    : board.every(square => square !== null)
      ? 'Draw!'
      : `Next player: ${isXNext ? 'X' : 'O'}`;

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
