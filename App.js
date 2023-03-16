import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const App = () => {
  const [playerOneTime, setPlayerOneTime] = useState(180.0);
  const [playerTwoTime, setPlayerTwoTime] = useState(180.0);
  const [activePlayer, setActivePlayer] = useState(null);
  const [firstHit, setFirstHit] = useState(true);
  const [pauseButtonEnabled, setPauseButtonEnabled] = useState(false);
  const [durationSelectorVisible, setDurationSelectorVisible] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState('3');
  const [selectedSeconds, setSelectedSeconds] = useState('0');
  const [customDuration, setCustomDuration] = useState(180.0);
  const [gameOver, setGameOver] = useState(false);


  const togglePlayer = (player, running) => {
    if (pauseButtonEnabled || gameOver) return;
  
    if (firstHit) {
      setActivePlayer(3 - player);
      setFirstHit(false);
    } else if (running) {
      setActivePlayer((prevActivePlayer) => (prevActivePlayer === 1 ? 2 : 1));
    }
  };

  const updateTime = () => {
    if (activePlayer !== null && !gameOver) {
      const setTime = activePlayer === 1 ? setPlayerOneTime : setPlayerTwoTime;
      
      setTime((prevTime) => {
        if (prevTime - 0.1 <= 0) {
          setGameOver(true);
          return 0;
        } else {
          return prevTime - 0.1;
        }
      });
    }
  };

  useEffect(() => {
    if (activePlayer !== null) {
      const intervalId = setInterval(updateTime, 100);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [activePlayer]);
  

  const resetTimers = (duration) => {
    const newDuration = typeof duration === "number" ? duration : customDuration;
    setPlayerOneTime(newDuration);
    setPlayerTwoTime(newDuration);
    setActivePlayer(null);
    setFirstHit(true);
    setGameOver(false);
  };
  

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const tenths = Math.floor((time % 1) * 10);

    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}.${tenths}`;
  };

  const renderDurationSelector = () => {
    const changeMinutes = (delta) => {
      setSelectedMinutes((prevMinutes) => {
        const newValue = parseInt(prevMinutes) + delta;
        return newValue >= 0 && newValue <= 60 ? newValue : prevMinutes;
      });
    };
    
    const changeSeconds = (delta) => {
      setSelectedSeconds((prevSeconds) => {
        const newValue = parseInt(prevSeconds) + delta;
        return newValue >= 0 && newValue < 60 ? newValue : prevSeconds;
      });
    };
  
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={durationSelectorVisible}
        onRequestClose={() => setDurationSelectorVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Set Duration</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity onPress={() => changeMinutes(-1)} style={styles.durationButton}>
              <Icon name="remove-outline" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.durationText}>{selectedMinutes} Minutes</Text>
            <TouchableOpacity onPress={() => changeMinutes(1)} style={styles.durationButton}>
              <Icon name="add-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <TouchableOpacity onPress={() => changeSeconds(-1)} style={styles.durationButton}>
              <Icon name="remove-outline" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.durationText}>{selectedSeconds} Seconds</Text>
            <TouchableOpacity onPress={() => changeSeconds(1)} style={styles.durationButton}>
              <Icon name="add-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.modalButton, { marginTop: 20 }]}
            onPress={() => {
              const newDuration = parseInt(selectedMinutes) * 60 + parseInt(selectedSeconds);
              setCustomDuration(newDuration);
              setDurationSelectorVisible(false);
              resetTimers(newDuration);
            }}
          >
            <Text style={styles.modalButtonText}>Set</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, { marginTop: 10 }]}
            onPress={() => setDurationSelectorVisible(false)}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.clock,
          activePlayer === 1 && styles.activeClock,
          styles.topClock,
        ]}
        onPress={() => !gameOver && togglePlayer(1, activePlayer === 1)}
        activeOpacity={1}
      >
        <Text style={styles.time}>{formatTime(playerOneTime)}</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetTimers}>
          <Icon name="refresh-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.setDurationButton,
            activePlayer === null && styles.setDurationButtonEnabled,
          ]}
          onPress={() => setDurationSelectorVisible(true)}
          disabled={activePlayer !== null}
        >
          <Icon name="time-outline" size={24} color="#000" />
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
          <Icon name="pause-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.clock, activePlayer === 2 && styles.activeClock]}
        onPress={() => !gameOver && togglePlayer(2, activePlayer === 2)}
        activeOpacity={1}
      >
        <Text style={styles.time}>{formatTime(playerTwoTime)}</Text>
      </TouchableOpacity>
      {renderDurationSelector()}
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
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 80,
  },
  pickerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  modalButton: {
    backgroundColor: '#A50000',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  setDurationButton: {
    backgroundColor: '#8c8c8c',
    borderRadius: 50,
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // pauseButton: {
  //   padding: 20,
  //   backgroundColor: '#8c8c8c',
  //   borderRadius: 50,
  //   marginRight: 20,
  // },
  setDurationButtonEnabled: {
    backgroundColor: '#A50000',
  },
  durationButton: {
    backgroundColor: '#A50000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    elevation: 5,
  },
  durationButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  durationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 10,
  },
});

export default App;
