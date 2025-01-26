import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import Voice from '@react-native-voice/voice';


const SpeechToText = () => {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);

  // Initialize the voice recognition event listeners
  React.useEffect(() => {
    Voice.onSpeechStart = () => setListening(true);
    Voice.onSpeechEnd = () => setListening(false);
    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        setText(event.value[0]);
      }
    };
    Voice.onSpeechError = (error) => {
      console.error('Speech Recognition Error:', error);
      Alert.alert('Error', `Speech recognition error: ${error.error.message}`);
      setListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setText('');
      setListening(true);
      await Voice.start('en-US'); // Set language as needed
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('Error', `Failed to start recognition: ${error.message}`);
    }
  };

  const stopListening = async () => {
    try {
      setListening(false);
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
      Alert.alert('Error', `Failed to stop recognition: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech to Text</Text>
      <Text style={styles.text}>{text || 'No text recognized yet.'}</Text>
      <Button
        title={listening ? 'Stop Listening' : 'Start Listening'}
        onPress={listening ? stopListening : startListening}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
});

export default SpeechToText;
