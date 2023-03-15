import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


const App = () => {
  const [playerOneTime, setPlayerOneTime] = useState(300.0);
  const [playerTwoTime, setPlayerTwoTime] = useState(300.0);
  const [activePlayer, setActivePlayer] = useState(null);
  const [firstHit, setFirstHit] = useState(true);
  const [pauseButtonEnabled, setPauseButtonEnabled] = useState(false);

  const togglePlayer = (player, running) => {
    if (pauseButtonEnabled) return;

    if (firstHit) {
      setActivePlayer(3 - player);
      setFirstHit(false);
    } else if (running) {
      setActivePlayer((prevActivePlayer) => (prevActivePlayer === 1 ? 2 : 1));
    }
  };

  const updateTime = () => {
    if (activePlayer !== null) {
      if (activePlayer === 1) {
        setPlayerOneTime((prevTime) => prevTime - 0.1);
      } else if (activePlayer === 2) {
        setPlayerTwoTime((prevTime) => prevTime - 0.1);
      }
    }
  };

  const resetTimers = () => {
    setPlayerOneTime(300.0);
    setPlayerTwoTime(300.0);
    setActivePlayer(null);
    setPauseButtonEnabled(false);
    setFirstHit(true);
  };

  useEffect(() => {
    if (activePlayer !== null) {
      const intervalId = setInterval(updateTime, 100);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [activePlayer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const tenths = Math.floor((time % 1) * 10);
  
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}.${tenths}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.clock,
          activePlayer === 1 && styles.activeClock,
          styles.topClock,
        ]}
        onPress={() => togglePlayer(1, activePlayer === 1)}
        activeOpacity={1}
      >
      <Text style={styles.time}>{formatTime(playerOneTime)}</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetTimers}>
          <Text style={styles.buttonText}>⟳</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.pauseButton,
            pauseButtonEnabled && styles.pauseButtonEnabled,
          ]}
          onPress={() => {
            if (pauseButtonEnabled || activePlayer !== null) {
              if (activePlayer === null) {
                setActivePlayer(firstHit);
              } else {
                setFirstHit(activePlayer);
                setActivePlayer(null);
              }
              setPauseButtonEnabled((prevState) => !prevState);
            }
          }}
        >
          <Text style={styles.buttonText}>‖</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.clock, activePlayer === 2 && styles.activeClock]}
        onPress={() => togglePlayer(2, activePlayer === 2)}
        activeOpacity={1}
      >
        <Text style={styles.time}>{formatTime(playerTwoTime)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clock: {
    flex: 1,
    width: '90%',
    padding: 20,
    margin: 10,
    backgroundColor: '#8c8c8c', // Subtle Scarlet color
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeClock: {
    backgroundColor: '#A50000'
  },
  topClock: {
    transform: [{ rotate: '180deg' }],
  },
  time: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '60%',
  },
  resetButton: {
    padding: 20,
    backgroundColor: '#8c8c8c',
    borderRadius: 50,
    marginLeft: 20,
  },
  pauseButton: {
    padding: 20,
    backgroundColor: '#8c8c8c',
    borderRadius: 50,
    marginRight: 20,
  },
  pauseButtonEnabled: {
    backgroundColor: '#A50000',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default App;
