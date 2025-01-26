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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/index';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const WriteReport = ({ route }) => {
  const navigation = useNavigation();
  const { user_id } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [complaintId, setComplaintId] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateComplaintId = () => {
    return 'CMP' + Date.now();
  };

  const saveToLocalStorage = async (key, data) => {
    try {
      const rawData = await AsyncStorage.getItem(key);
      console.log(`Raw data for ${key}:`, rawData);

      let existingData = [];

      if (rawData) {
        try {
          existingData = JSON.parse(rawData);
          if (!Array.isArray(existingData)) {
            console.warn(`Data for key ${key} is not an array. Overwriting it.`);
            existingData = [];
          }
        } catch (parseError) {
          console.warn(`Error parsing data for key ${key}:`, parseError);
          existingData = [];
        }
      }

      const updatedData = [...existingData, data];
      console.log(`Updated data for ${key}:`, updatedData);

      await AsyncStorage.setItem(key, JSON.stringify(updatedData));
    } catch (error) {
      console.error(`Error saving to local storage (${key}):`, error);
    }
  };

  const removeSyncedDataFromStorage = async (complaint_id) => {
    try {
      const titleData = JSON.parse(await AsyncStorage.getItem('titleData')) || [];
      const detailData = JSON.parse(await AsyncStorage.getItem('complaintDetailData')) || [];
      const imagesData = JSON.parse(await AsyncStorage.getItem('imagesData')) || [];

      const updatedTitles = titleData.filter((item) => item.complaint_id !== complaint_id);
      const updatedDetails = detailData.filter((item) => item.complaint_id !== complaint_id);
      const updatedImages = imagesData.filter((item) => item.complaint_detail_id !== complaint_id);

      await AsyncStorage.setItem('titleData', JSON.stringify(updatedTitles));
      await AsyncStorage.setItem('complaintDetailData', JSON.stringify(updatedDetails));
      await AsyncStorage.setItem('imagesData', JSON.stringify(updatedImages));
    } catch (error) {
      console.error('Error removing synced data from local storage:', error);
    }
  };

  const syncPendingData = async () => {
    setLoading(true); // Start loading
    try {
      const rawTitleData = await AsyncStorage.getItem('titleData');
      const rawDetailData = await AsyncStorage.getItem('complaintDetailData');
      const rawImagesData = await AsyncStorage.getItem('imagesData');

      const pendingTitles = rawTitleData
        ? Array.isArray(JSON.parse(rawTitleData))
          ? JSON.parse(rawTitleData)
          : [JSON.parse(rawTitleData)]
        : [];
      const pendingDetails = rawDetailData
        ? Array.isArray(JSON.parse(rawDetailData))
          ? JSON.parse(rawDetailData)
          : [JSON.parse(rawDetailData)]
        : [];
      const pendingImages = rawImagesData ? JSON.parse(rawImagesData) : [];

      if (pendingTitles.length === 0 && pendingDetails.length === 0 && pendingImages.length === 0) {
        Alert.alert("No Sync", "No data is pending for syncing");
        console.log('No pending data to sync.');
        return;
      }

      for (const titleData of pendingTitles) {
        try {
          const complaint_id = await handleTitleRegister(titleData.title, titleData.user_id);

          const detail = pendingDetails.find((d) => d.complaint_id === titleData.complaint_id);
          let complaint_detail_id = null;

          if (detail) {
            complaint_detail_id = await handleComplaintRegister(detail.complaint_detail, complaint_id);
          }

          const imagesToUpload = pendingImages.filter((img) => img.complaint_detail_id === titleData.complaint_id);
          for (const img of imagesToUpload) {
            await handleImageUpload(complaint_detail_id, img.url);
          }

          await removeSyncedDataFromStorage(titleData.complaint_id);
        } catch (error) {
          console.error('Error syncing data for complaint ID:', titleData.complaint_id, error);
        }
      }

      Alert.alert('Success', 'All pending complaints have been synced.');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleTitleRegister = async (title, user_id) => {
    try {
      const response = await api.post('/add-complaint', { title, user_id });
      return response.data.data; // complaint_id
    } catch (error) {
      console.error('Error registering title:', error);
      throw error;
    }
  };

  const handleComplaintRegister = async (description, complaint_id) => {
    try {
      const response = await api.post('/add-complaint-detail', { description, complaint_id });
      return response.data.data; // complaint_detail_id
    } catch (error) {
      console.error('Error registering complaint details:', error);
      throw error;
    }
  };

  const handleImageUpload = async (complaint_detail_id, imageUri) => {
    try {
      const formData = new FormData();
      const imageName = imageUri.split('/').pop();
      formData.append('complaint_detail_id', complaint_detail_id);
      formData.append('url', {
        uri: imageUri,
        type: 'image/jpeg',
        name: imageName,
      });

      await api.post('/add-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading

    if (step === 1 && !title.trim()) {
      setLoading(false); // End loading if validation fails
      Alert.alert('Error', 'Please enter a title.');
      return;
    }
    if (step === 2 && !description.trim()) {
      setLoading(false); // End loading if validation fails
      Alert.alert('Error', 'Please enter the complaint details.');
      return;
    }

    try {
      if (step === 1) {
        const id = generateComplaintId();
        setComplaintId(id);
        const titleData = { title, complaint_id: id, user_id };
        await saveToLocalStorage('titleData', titleData);
        setStep(2);
      } else if (step === 2) {
        const detailData = { complaint_detail: description, complaint_id: complaintId };
        await saveToLocalStorage('complaintDetailData', detailData);
        setStep(3);
      } else if (step === 3) {
        const imageData = images.map((image, index) => ({
          complaint_detail_id: complaintId,
          name: `image_${index + 1}`,
          url: image,
        }));
        for (const img of imageData) {
          await saveToLocalStorage('imagesData', img);
        }

        Alert.alert('Success', 'Complaint saved locally.');

        setTitle('');
        setDescription('');
        setImages([]);
        setStep(1);
        navigation.navigate('Home', { refresh: true });
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Failed to submit the complaint. Please try again later.');
    } finally {
      setLoading(false); // End loading
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
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.heading}>Register Complaint</Text>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1877F2" />
          </View>
        )}

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

            <TouchableOpacity style={styles.button} onPress={syncPendingData}>
              <Text style={styles.buttonText}>Sync Data</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            {/* <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter your complaint..."
              multiline
              value={description}
              onChangeText={setDescription}
            /> */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your complaint..."
                multiline
                value={description}
                onChangeText={setDescription}
              />
              <TouchableOpacity style={styles.micIcon} onPress={() => console.log('Microphone Pressed')}>
                <Icon name="microphone" size={20} color="#888" />
              </TouchableOpacity>
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
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  titleInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#1877F2',
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  loaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    zIndex: 1,
  },
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
});

export default WriteReport;
