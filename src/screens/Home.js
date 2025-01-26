import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Modal, TextInput, Button, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NetworkStatus from '../network/network';

const HomeScreen = ({ navigation, route }) => {
  
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [localTitles, setLocalTitles] = useState([]);

  const [filterDate, setFilterDate] = useState('');

  const [isFilterApplied, setIsFilterApplied] = useState(false); 

  const [isFilterDatePickerVisible, setIsFilterDatePickerVisible] = useState(false);

  const showFilterDatePicker = () => setIsFilterDatePickerVisible(true);
  const hideFilterDatePicker = () => setIsFilterDatePickerVisible(false);

  const handleFilterDateConfirm = (date) => {
    setFilterDate(format(date, 'yyyy-MM-dd'));
    hideFilterDatePicker();
  };

  const deleteDataFromLocalStorage = async (key) => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        await AsyncStorage.removeItem(key);
        console.log(`${key} has been removed from local storage.`);
        Alert.alert('Success', `${key} has been deleted from local storage.`);
      } else {
        Alert.alert('Not Found', `${key} does not exist in local storage.`);
      }
    } catch (error) {
      console.error('Error deleting data from AsyncStorage:', error);
      Alert.alert('Error', 'Failed to delete data from local storage.');
    }
  }

  const getImages = async() => {
    const getImageData = await AsyncStorage.getItem('imagesData');
    console.log("local images data : ", getImageData);
  }

  const getUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchComplaints(parsedUser.user_id);
      }
    } catch (error) {
      console.log("Error retrieving user:", error);
    }
  };

  const getComplaintsTitlesLocal = async () => {
    try {
      const titleData = await AsyncStorage.getItem('titleData');
      if (titleData) {
        const parsedTitle = JSON.parse(titleData);
        const titlesArray = Array.isArray(parsedTitle) ? parsedTitle : [parsedTitle];
        setLocalTitles(titlesArray);
        setIsFilterApplied(false);
      }
    } catch (error) {
      console.log("Error retrieving title:", error);
    }
  };

  const fetchComplaints = async (user_id, search = '', startDate = '', endDate = '', filterType = '', filterDate = '') => {
    try {
      const response = await api.get("/filter", {
        params: {
          user_id,
          search,
          startDate,
          endDate,
          filterType,
          filterDate
        }
      });
      const responseData = await response.data.data;
      console.log("Length of the filter response : ", responseData.length);
      setComplaints(responseData);
    } catch (error) {
      console.error("Error fetching complaints:", error.message);
      Alert.alert("Error", "Failed to load complaints. Please try again later.");
    }
  };
  
  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "No",
          onPress: () => console.log("Logout Cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user');
              navigation.replace('Login');
            } catch (error) {
              console.log('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  const showStartDatePicker = () => setStartDatePickerVisible(true);
  const hideStartDatePicker = () => setStartDatePickerVisible(false);

  const showEndDatePicker = () => setEndDatePickerVisible(true);
  const hideEndDatePicker = () => setEndDatePickerVisible(false);

  const handleStartDateConfirm = (date) => {
    setStartDate(format(date, 'yyyy-MM-dd'));
    hideStartDatePicker();
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(format(date, 'yyyy-MM-dd'));
    hideEndDatePicker();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await fetchComplaints(user.user_id, searchQuery, startDate, endDate, filterType);
    }
    setRefreshing(false);
    setIsFilterApplied(false);
  };

  const handleSearch = () => {
    setSearchModalVisible(true);
  };

  const handleSearchSubmit = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await api.get("/search", { params: { searchTerm: searchQuery } });
        const responseData = await response.data.data;
        setComplaints(responseData);
        setSearchModalVisible(false);
      } catch (error) {
        console.error("Error searching complaints:", error.message);
        Alert.alert("Error", "Failed to search complaints. Please try again later.");
      }
    } else {
      Alert.alert("Input Error", "Please enter a search term.");
    }
  };

  const handleFilter = () => {
    setFilterModalVisible(true);
  };

  const handleFilterSubmit = async () => {
    setIsFilterApplied(true);
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      Alert.alert("Error", "Start date cannot be later than end date.");
      setEndDate('');
      setStartDate('');
      return;
    }

    if (!filterType) {
      setFilterType('latest');
    }

    try {
      await fetchComplaints(user.user_id, searchQuery, startDate, endDate, filterType, filterDate);
      setStartDate('');
      setEndDate('');
      setFilterType('');
      setFilterDate('');

      setFilterModalVisible(false);
    } catch (error) {
      console.error("Error applying filter:", error.message);
      Alert.alert("Error", "Failed to apply filter. Please try again later.");
    }
  };

  useEffect(() => {
    getUser();
    getComplaintsTitlesLocal();
    // deleteDataFromLocalStorage('titleData');
    // deleteDataFromLocalStorage('imagesData');
    // deleteDataFromLocalStorage('complaintDetailData');
    // showDate();
    getImages();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Logout Button */}
      <View style={styles.logoutButtonContainer}>
        <NetworkStatus />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}><Ionicons name='log-out' size={24} /></Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        {user ? (
          <>
            <View style={styles.profileIcon}>
              <Ionicons name="person" size={55} color="#3b82f6" />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.officerText}>Officer Name: {user.first_name} {user.last_name}</Text>
              <Text style={styles.officerText}>Collar No: {user.collar_id}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading user details...</Text>
        )}
      </View>

      {/* Feature Buttons */}
      <View style={styles.featuredSection}>
        <TouchableOpacity style={styles.writeButton} onPress={() => navigation.navigate("Write", { user_id: user.user_id })}>
          <Text style={styles.writeButtonText}>Write a Report</Text>
        </TouchableOpacity>
        <View style={styles.featureButtons}>
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={32} style={styles.featureButtonIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFilter}>
            <Ionicons name="filter" size={32} style={styles.featureButtonIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Default Data Section */}
      {!isFilterApplied && (
        <View style={styles.listContainer}>
          {localTitles && localTitles.length > 0 ? (
            localTitles.map((title, index) => (
              <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('Detail', { complaint_id: title.complaint_id })
                  }
                >
                  <View style={styles.complaintBox}>
                    <Ionicons name="document-text" size={50} color="#3b82f6" />
                    <Text style={styles.complaintTitle}>{title.title}</Text>
                    <Text style={styles.complaintTime}>
                      {format(new Date(title.created_at), 'MMM dd, yyyy')}
                    </Text>
                  </View>
                </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No pending complaints available.</Text>
          )}
        </View>
      )}

      {/* Filtered Server Data Section */}
      {isFilterApplied && (
        <View style={styles.complaintsContainer}>
          {complaints.length > 0 ? (
            [...complaints]
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
              .reverse()
              .map((complaint) => (
                <TouchableOpacity
                  key={complaint.complaint_id}
                  onPress={() =>
                    navigation.navigate('Detail', { complaint_id: complaint.complaint_id })
                  }
                >
                  <View style={styles.complaintBox}>
                    <Ionicons name="document-text" size={50} color="#3b82f6" />
                    <Text style={styles.complaintTitle}>{complaint.title}</Text>
                    <Text style={styles.complaintTime}>
                      {format(new Date(complaint.created_at), 'MMM dd, yyyy')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
          ) : (
            <Text style={styles.noComplaintsText}>No complaints available.</Text>
          )}
        </View>
      )}
      {/* Filter Modal */}
      <Modal
        transparent={true}
        visible={isFilterModalVisible}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Complaints by Date</Text>

            {/* Start Date Picker */}
            <TouchableOpacity onPress={showStartDatePicker}>
              <Text style={styles.input}>{startDate || "Select Start Date"}</Text>
            </TouchableOpacity>

            {/* End Date Picker */}
            <TouchableOpacity onPress={showEndDatePicker}>
              <Text style={styles.input}>{endDate || "Select End Date"}</Text>
            </TouchableOpacity>

            {/* Filter Date Picker */}
            {/* <TouchableOpacity onPress={() => setIsFilterDatePickerVisible(true)}>
              <Text style={styles.input}>{filterDate || "Select Filter Date"}</Text>
            </TouchableOpacity> */}

            {/* Filter Type */}
            <Text style={styles.filterLabel}>Filter by Type</Text>
            <View style={styles.filterButtons}>
              <Button title="Today" onPress={() => setFilterType('today')} />
              <Button title="Latest" onPress={() => setFilterType('latest')} />
            </View>

            {/* Apply Filter and Cancel Buttons */}
            <View style={styles.buttonContainer}>
              <Button title="Apply Filter" onPress={handleFilterSubmit} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setFilterModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Start Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={hideStartDatePicker}
      />

      {/* End Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
      />
{/* 
      <DateTimePickerModal
        isVisible={isFilterDatePickerVisible}
        mode="date"
        onConfirm={handleFilterDateConfirm}
        onCancel={hideFilterDatePicker}
      /> */}


      {/* Search Modal */}
      <Modal
        transparent={true}
        visible={isSearchModalVisible}
        animationType="slide"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search Complaints</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter search term"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
            />
            <View style={styles.buttonContainer}>
              <Button title="Search" onPress={handleSearchSubmit} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setSearchModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};




const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#f4f7fc' },
  logoutButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" },
  logoutButton: { padding: 10 },
  logoutButtonText: { fontSize: 22, color: '#3b82f6' },
  profileSection: { flexDirection: 'row', marginBottom: 20, padding: 10, borderRadius: 8, backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  profileIcon: { marginRight: 15 },
  profileDetails: { flexDirection: 'column', justifyContent: 'center' },
  officerText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  loadingText: { textAlign: 'center', color: '#888' },
  writeButton: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, marginBottom: 15 },
  writeButtonText: { textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' },
  featureButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  featureButtonIcon: { margin: 10, color: '#3b82f6' },
  complaintsContainer: { marginTop: 3, marginBottom: 20 },
  complaintBox: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 10, backgroundColor: '#ffffff', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  complaintTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#333' },
  complaintTime: { fontSize: 14, color: 'gray' },
  noComplaintsText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: '#888' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, width: '100%', backgroundColor: '#f9f9f9' },
  filterLabel: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  filterButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  apply: { marginBottom: 10 },
  buttonContainer: {
    marginTop: 15,
  },
  listContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // for Android
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  icon: {
    marginLeft: 10,
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});

export default HomeScreen;
