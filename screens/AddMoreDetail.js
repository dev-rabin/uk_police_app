import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon

const AddMoreDetail = () => {
  const [complaint, setComplaint] = useState('');

  const handleSubmit = () => {
    if (!complaint.trim()) {
      Alert.alert('Error', 'Please enter your complaint.');
      return;
    }
    Alert.alert('Success', 'Complaint submitted successfully.');
    setComplaint('');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter add more details..."
            multiline
            value={complaint}
            onChangeText={setComplaint}
          />
          <TouchableOpacity style={styles.micIcon} onPress={() => console.log('Microphone Pressed')}>
            <Icon name="microphone" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.upload_image}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Image Upload</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.buttonContainer}
        >
        </KeyboardAvoidingView>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#FFF' },
  heading: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items at the top
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    height: 150,
    marginBottom: 15,
    position: 'relative', // Make sure the mic icon can be positioned absolutely
  },
  micIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  input: {
    flex: 1,
    height: 150,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    elevation: 10,
  },
  button: {
    backgroundColor: '#1877F2',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  upload_image: {
    padding: 10,
    backgroundColor: '#1877F2',
    borderRadius: 8,
    elevation: 10,
  },
});

export default AddMoreDetail;
