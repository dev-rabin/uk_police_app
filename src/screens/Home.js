import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Modal, TextInput, Button, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('');

  // Fetch user information from AsyncStorage
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

  // Fetch complaints, passing user ID and optional filters
  const fetchComplaints = async (user_id, search = '', startDate = '', endDate = '', filterType = '') => {
    try {
      const response = await api.get("/filter", {
        params: {
          user_id,
          search,
          startDate,
          endDate,
          filterType
        }
      });
      const responseData = await response.data.data;
      setComplaints(responseData);
    } catch (error) {
      console.error("Error fetching complaints:", error.message);
      Alert.alert("Error", "Failed to load complaints. Please try again later.");
    }
  };

  // Logout handler
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


  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await fetchComplaints(user.user_id, searchQuery, startDate, endDate, filterType);
    }
    setRefreshing(false);
  };


  const handleFilter = () => {
    setFilterModalVisible(true);
  };


  const handleFilterSubmit = async () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      Alert.alert("Error", "Start date cannot be later than end date.");
      return;
    }

    if (!filterType) {
      setFilterType('latest');
    }

    try {
      await fetchComplaints(user.user_id, searchQuery, startDate, endDate, filterType);
      setFilterModalVisible(false);
    } catch (error) {
      console.error("Error applying filter:", error.message);
      Alert.alert("Error", "Failed to apply filter. Please try again later.");
    }
  };

  useEffect(() => {
    getUser();
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

      {/* Complaints List */}
      <View style={styles.complaintsContainer}>
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <TouchableOpacity
              key={complaint.complaint_id}
              onPress={() => navigation.navigate('Detail', { complaint_id: complaint.complaint_id })}
            >
              <View style={styles.complaintBox}>
                <Ionicons name="document-text" size={50} color="#3b82f6" />
                <Text style={styles.complaintTitle}>{complaint.title}</Text>
                <Text style={styles.complaintTime}>
                  {format(new Date(complaint.created_at), 'MMMM dd, yyyy')}
                </Text>
              </View>
            </TouchableOpacity>

          ))
        ) : (
          <Text style={styles.noComplaintsText}>No complaints available.</Text>
        )}
      </View>

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
            <TextInput
              style={styles.input}
              placeholder="Start Date (YYYY-MM-DD)"
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              style={styles.input}
              placeholder="End Date (YYYY-MM-DD)"
              value={endDate}
              onChangeText={setEndDate}
            />

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
  logoutButtonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
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
  complaintsContainer: { marginVertical: 3 },
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
});

export default HomeScreen;
