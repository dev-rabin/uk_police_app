import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker'; 
import api from '../api';

const AddMoreDetail = ({ route, navigation }) => {
  const { complaint_id } = route.params;
  const [complaint, setComplaint] = useState('');
  const [images, setImages] = useState([]);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      handleImagePick();
    } else {
      Alert.alert('Permission Denied', 'You need to grant permission to select images.');
    }
  };

  const handleComplaintDetailsSubmit = async (description) => {
    try {
      const response = await api.post('/add-complaint-detail', {
        complaint_id,
        description,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error adding complaint details:', error);
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
      console.log("Form Data : ", formData);
      
      const response = await api.post('/add-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const handleImagePick = async () => {
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

  const handleSubmit = async () => {
    if (!complaint.trim()) {
      Alert.alert('Error', 'Please enter your complaint.');
      return;
    }
  
    try {
      const complaintDetail = await handleComplaintDetailsSubmit(complaint);
      const complaint_detail_id = complaintDetail;
      if (images.length > 0) {
        for (const url of images) {
          await handleImageUpload(complaint_detail_id, url);
        }
        Alert.alert('Success', 'Complaint added successfully with images.');
      } else {
        Alert.alert('Success', 'Complaint added successfully without image.');
      }
      setComplaint('');
      setImages([]);
      navigation.reset({
        index: 0, 
        routes: [{ name: 'Home' }],
      });
  
    } catch (error) {
      Alert.alert('Error', 'There was an error while submitting the complaint. Please try again.');
    }
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

        {/* Show selected images if they exist */}
        {images.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            {images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.imagePreview} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.upload_image} onPress={requestPermission}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
            Image Upload
          </Text>
        </TouchableOpacity>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.buttonContainer} />
      </ScrollView>
      {/* <TouchableOpacity style={styles.button}  onPress={()=> navigation.navigate("Speech")}>
        <Text style={styles.buttonText}>Speech to text</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#FFF' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    height: 150,
    marginBottom: 15,
    position: 'relative',
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
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // This allows images to wrap in the container
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 5,
  },
});

export default AddMoreDetail;