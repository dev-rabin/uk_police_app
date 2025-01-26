import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddMoreDetail = ({ route, navigation }) => {
  const { complaint_id } = route.params;
  console.log("add more detail complaint_id : ", complaint_id);

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

  const showDate = () => {
    const created_at = Date.now();
    const date = new Date(created_at);
    const sqlDate = date.toISOString().slice(0, 19).replace('T', ' ');
    return sqlDate;
  };

  const generateComplaintId = () => {
    return 'CMP' + Date.now();
  };

  const handleComplaintDetailsSubmit = async () => {
    const complaintDetailsData = {
      complaint_detail_id: generateComplaintId(),
      description: complaint,
      complaint_id: complaint_id,
      created_at: showDate(),
    };

    try {
      await AsyncStorage.setItem('complaintDetailData', JSON.stringify(complaintDetailsData));
      console.log('Complaint details saved');
    } catch (error) {
      console.error('Error saving complaint details:', error);
    }
    return complaintDetailsData;
  };

  const handleImageUpload = async () => {
    const imagesData = images.map((uri) => ({ uri }));
    try {
      await AsyncStorage.setItem('imagesData', JSON.stringify(imagesData));
      console.log('Images saved');
    } catch (error) {
      console.error('Error saving images:', error);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      multiple: true,
    });

    if (!result.canceled) {
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
      // Save complaint details and images
      await handleComplaintDetailsSubmit();
      await handleImageUpload();

      Alert.alert('Success', 'Complaint added successfully with images.');
      setComplaint('');
      setImages([]);

      // Navigate to the Home screen after submission
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      Alert.alert('Error', 'There was an error while submitting the complaint. Please try again.');
      console.error('handleSubmit : ', error);
    }
  };

  useEffect(() => {
    // getLocalDetails();
  })

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
    flexWrap: 'wrap',
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
