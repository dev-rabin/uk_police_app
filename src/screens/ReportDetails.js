import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import api from '../api';

const image_url = "http://192.168.1.7:4000/api";

const ReportDetails = ({ route, navigation }) => {
  const [complaintDetail, setComplaintDetail] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { complaint_id } = route.params;

  const fetchComplaintDetails = async (complaint_id) => {
    try {
      const response = await api.get(`/complaint/${complaint_id}`);
      const responseData = response.data.data;
      setComplaintDetail(responseData);
    } catch (error) {
      console.log("Error fetching details of complaint:", error);
    }
  };

  useEffect(() => {
    if (complaint_id) {
      fetchComplaintDetails(complaint_id);
    }
  }, [complaint_id]);

  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {complaintDetail ? (
          <>
            <Text style={styles.detailTitle}>{complaintDetail.title}</Text>
            {/* Loop through each description */}
            {complaintDetail.details?.map((detail, index) => {
              const zonedDate = new Date(detail.created_at);
              const ukTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Europe/London',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }).format(zonedDate);

              return (
                <View key={index} style={styles.detailBox}>
                  <Text style={styles.dateText}>Created On: {ukTime}</Text>
                  <Text style={styles.detailContent}>{detail.description}</Text>

                  {/* Render images if available */}
                  {detail.images?.length > 0 && (
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
                      {detail.images.map((image, imgIndex) => (
                        <TouchableOpacity
                          key={imgIndex}
                          onPress={() => handleImagePress(`${image_url}${image.url}`)}
                          style={styles.imageWrapper}
                        >
                          <Image
                            source={{ uri: `${image_url}${image.url}` }}
                            style={styles.image}
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}

                </View>
              );
            })}
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
        onPress={() => navigation.navigate("Add More", { complaint_id })}
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
  imagesContainer: { flexDirection: 'row', marginTop: 10, overflow: "scroll", },
  imageWrapper: { marginRight: 10, marginBottom: 10 },
  image: { width: 80, height: 80 },
  imageText: { fontSize: 12, textAlign: 'center', marginTop: 5, color: '#555' },

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
