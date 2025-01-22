import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../api';

const WriteReport = ({ route }) => {
  const navigation = useNavigation();
  const { user_id } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [complaint_id, setComplaintId] = useState(null);
  const [complaint_detail_id, setComplaintDetailId] = useState(null); // Add state for complaint_detail_id
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);

  const handleTitleRegister = async (title, user_id) => {
    try {
      const response = await api.post('/add-complaint', { title, user_id });
      if (response.data && response.data.data) {
        setComplaintId(response.data.data); // Set complaint_id here
        return response.data.data; // Return complaint_id
      }
    } catch (error) {
      console.error('Error registering title:', error);
      throw error;
    }
  };

  const handleComplaintRegister = async (description, complaint_id) => {
    try {
      const response = await api.post('/add-complaint-detail', {
        description,
        complaint_id,
      });
      setComplaintDetailId(response.data.data); // Store the complaint_detail_id here
      return response.data.data;
    } catch (error) {
      console.error('Error registering complaint:', error);
      throw error;
    }
  };

  const handleImageUpload = async (complaint_detail_id, imageUri) => {
    const formData = new FormData();
    formData.append('complaint_detail_id', complaint_detail_id);
    const imageName = imageUri.split('/').pop();
    const imageType = 'image/jpeg';

    formData.append('url', {
      uri: imageUri,
      type: imageType,
      name: imageName,
    });

    try {
      const response = await api.post('/add-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
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
        const complaint_id = await handleTitleRegister(title, user_id);
        console.log('Title Registered:', complaint_id);
        setStep(2);
      } else if (step === 2) {
        if (!complaint_id) {
          Alert.alert('Error', 'Complaint ID is missing.');
          return;
        }
        const complaintDetailId = await handleComplaintRegister(
          description,
          complaint_id
        );
        console.log('Complaint Registered:', complaintDetailId);
        setStep(3);
      } else if (step === 3) {
        if (!complaint_detail_id) {
          Alert.alert('Error', 'Complaint detail ID is missing.');
          return;
        }
        if (images.length > 0) {
          for (const url of images) {
            await handleImageUpload(complaint_detail_id, url);
          }
          Alert.alert('Success', 'Complaint added successfully with images.');
        } else {
          Alert.alert('Success', 'Complaint added successfully without image.');
        }

        // Reset the form
        setTitle('');
        setDescription('');
        setImages([]);
        setStep(1);
        navigation.navigate('Home', { refresh: true });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit the complaint. Please try again later.');
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      multiple: true,
    });

    if (!result.cancelled) {
      setImages((prevImages) => [...prevImages, ...result.assets.map((asset) => asset.uri)]);
    } else {
      console.log('User canceled image picker');
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
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View>
            <TouchableOpacity style={styles.button} onPress={pickImages}>
              <Text style={styles.buttonText}>Select Images</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
              {images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.image} />
              ))}
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
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});

export default WriteReport;
