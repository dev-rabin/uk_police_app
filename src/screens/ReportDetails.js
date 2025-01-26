import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import api from '../api';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

const image_url = "http://192.168.1.2:4000/api";

const ReportDetails = ({ route, navigation }) => {
  const [complaintDetail, setComplaintDetail] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { complaint_id } = route.params;
  const [localDetails, setLocalDetails] = useState(null);
  const [localImages, setLocalImages] = useState(null);
  const [complaintDetailId, setComplaintDetailId] = useState(null); // To hold the complaint_detail_id

  const fetchComplaintDetails = async (complaint_id) => {
    try {
      const response = await api.get(`/complaint/${complaint_id}`);
      if (response?.data?.data) {
        const responseData = response.data.data;
        setComplaintDetail(responseData);
        setComplaintDetailId(responseData.complaint_detail_id);
      } else {
        console.log("No data in response");
      }
    } catch (error) {
      console.log("Error fetching details of complaint:", error);
    }
  };

  const getLocalDetails = async () => {
    try {
      const localDetails = await AsyncStorage.getItem("complaintDetailData");
      console.log("localDetails", localDetails);
      
      if (localDetails) {
        const parsedDetails = JSON.parse(localDetails);
        if (Array.isArray(parsedDetails)) {
          const filteredDetail = parsedDetails.find((item) => item.complaint_id === complaint_id);
          if (filteredDetail) {
            setComplaintDetailId(filteredDetail.complaint_detail_id);
            setLocalDetails(filteredDetail);
          } else {
            console.log("No matching details found locally.");
          }
        } else if (parsedDetails && typeof parsedDetails === 'object') {
          if (parsedDetails.complaint_id === complaint_id) {
            setComplaintDetailId(parsedDetails.complaint_detail_id);
            setLocalDetails(parsedDetails);
          } else {
            console.log("No matching details found locally.");
          }
        } else {
          console.log("The stored data is not in the expected format.");
        }
      } else {
        console.log("No local details found.");
      }
    } catch (error) {
      console.log("Error fetching local complaint details:", error);
    }
  };



  const getLocalImages = async (complaint_detail_id) => {
    try {
      const localImages = await AsyncStorage.getItem("imagesData");
      if (localImages) {
        const imagesArray = JSON.parse(localImages);
        console.log("Stored images in AsyncStorage:", imagesArray); // Log the fetched images
        if (Array.isArray(imagesArray)) {
          const filteredImages = imagesArray.filter(
            (image) => image.complaint_detail_id === complaint_detail_id
          );
          setLocalImages(filteredImages);
        } else {
          console.log("The fetched data is not an array:", imagesArray);
        }
      } else {
        console.log("No images found in local storage.");
      }
    } catch (error) {
      console.log("Error fetching local images:", error);
    }
  };


  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    if (complaint_id) {
      console.log('Complaint ID:', complaint_id);
      fetchComplaintDetails(complaint_id);
      getLocalDetails();
    }
  }, [complaint_id]);

  useEffect(() => {
    console.log("complaint_detail_id passed to getLocalImages:", complaintDetailId);
    if (complaintDetailId) {
      getLocalImages(complaintDetailId);
    }
  }, [complaintDetailId]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {complaintDetail ? (
          <>
            {/* Render API Data */}
            <Text style={styles.detailTitle}>{complaintDetail.title || "Complaint Details"}</Text>
            <Text style={styles.dateText}>
              {/* Created On: {format(new Date(complaintDetail.created_at), 'MMM dd, yyyy hh:mm a')} */}
            </Text>
            {complaintDetail.details?.map((detail, index) => (
              <View key={index} style={styles.detailBox}>
                <Text style={styles.dateText}>
                  Detail Created On: {format(new Date(detail.created_at), 'MMM dd, yyyy hh:mm a')}
                </Text>
                <Text style={styles.detailContent}>{detail.description}</Text>
                {detail.images?.length > 0 && (
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={styles.imagesContainer}
                  >
                    {detail.images.map((image, imgIndex) => {
                      const imageUri = `${image_url}${image.url}`;
                      return (
                        <TouchableOpacity
                          key={imgIndex}
                          onPress={() => handleImagePress(imageUri)}
                          style={styles.imageWrapper}
                        >
                          <Image source={{ uri: imageUri }} style={styles.image} />
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            ))}
          </>
        ) : localDetails ? (
          <>
            {/* Render Local Data */}
            <Text style={styles.detailTitle}>{localDetails.title || "Complaint Details"}</Text>
            <Text style={styles.dateText}>
              {/* Created On: {format(new Date(localDetails.created_at), 'MMM dd, yyyy hh:mm a')} */}
            </Text>
            <View style={styles.detailBox}>
              <Text style={styles.dateText}>
                Detail Created On: {format(new Date(localDetails.created_at), 'MMM dd, yyyy hh:mm a')}
              </Text>
              <Text style={styles.detailContent}>{localDetails.description}</Text>
              {localImages?.length > 0 && (
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={styles.imagesContainer}
                >
                  {localImages.map((image, imgIndex) => (
                    <TouchableOpacity
                      key={imgIndex}
                      onPress={() => handleImagePress(image.url)} // Assuming local images have 'uri'
                      style={styles.imageWrapper}
                    >
                      <Image source={{ uri: image.url }} style={styles.image} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        ) : (
          <Text>No records found!</Text>
        )}
      </ScrollView>

      {/* Modal for Full-Screen Image */}
      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
          )}
        </View>
      </Modal>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          console.log('Navigating to Add More Detail screen');
          navigation.navigate("Add More", { complaint_id });
        }}
      >
        <Text style={styles.buttonText}>Add More Detail</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollView: { flex: 1, padding: 15 },
  detailBox: {
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  detailTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: "center" },
  detailContent: { fontSize: 14, textAlign: 'justify' },
  dateText: { fontSize: 12, color: '#555', marginVertical: 5 },

  // Image Styles
  imagesContainer: { flexDirection: 'row', marginTop: 10 },
  imageWrapper: { marginRight: 10, marginBottom: 10 },
  image: { width: 80, height: 80 },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: { width: '90%', height: '70%', resizeMode: 'contain' },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
  },
  modalCloseText: { color: '#007AFF', fontWeight: 'bold' },

  // Floating Button Styles
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 13,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: "bold",
  },
});

export default ReportDetails;
