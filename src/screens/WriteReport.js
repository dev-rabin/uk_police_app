import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';

const WriteReport = ({ route }) => {
  const navigation = useNavigation();
  const { user_id } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [complaint_id, setComplaintId] = useState(null);
  const [step, setStep] = useState(1);

  const handleTitleRegister = async (title, user_id) => {
    try {
      const response = await api.post('/add-complaint', { title, user_id });
      if (response.data && response.data.data) {
        setComplaintId(response.data.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error registering title:", error);
      throw error;
    }
  };

  const handleComplaintRegister = async (description, complaint_id) => {
    try {
      const response = await api.post('/add-complaint-detail', { description, complaint_id });
      return response.data;
    } catch (error) {
      console.error("Error registering complaint:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (step === 1 && !title.trim()) {
      Alert.alert('Error', 'Please enter a title.');
      return;
    }
    if (step === 2 && !description.trim()) {
      Alert.alert('Error', 'Please enter the complaint details.');
      return;
    }

    try {
      if (step === 1) {
        const titleResponse = await handleTitleRegister(title, user_id);
        console.log('Title Registered:', titleResponse);
        setStep(2);
      } else if (step === 2) {
        if (!complaint_id) {
          Alert.alert('Error', 'Complaint ID is missing.');
          return;
        }
        const complaintResponse = await handleComplaintRegister(description, complaint_id);
        console.log('Complaint Registered:', complaintResponse);

        // Navigate back to Home and trigger refresh
        Alert.alert('Success', 'Complaint submitted successfully.');
        setTitle('');
        setDescription('');
        setStep(1);
        navigation.navigate('Home', { refresh: true });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit the complaint. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.heading}>Register Complaint</Text>

        {step === 1 && (
          <View>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter Title"
              value={title}
              onChangeText={setTitle}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter your complaint..."
                multiline
                value={description}
                onChangeText={setDescription}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#FFF' },
  scrollViewContainer: { paddingBottom: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  titleInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    height: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  input: {
    height: 100,
    textAlignVertical: 'top',
    flex: 1,
  },
  button: {
    backgroundColor: '#1877F2',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    elevation: 5,
    marginTop: 15,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default WriteReport;
