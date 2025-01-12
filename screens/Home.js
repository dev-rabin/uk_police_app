import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const complaints = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Complaint ${i + 1}`,
  }));

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={55} color="black" />
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.officerText}>Officer Name: John Doe</Text>
          <Text style={styles.officerText}>Collar No: B 84</Text>
        </View>
      </View>

      {/* Feature Buttons */}
      <View style={styles.featured_section}>
      <TouchableOpacity style={styles.write_button} onPress={()=>navigation.navigate("Write")}>
      <Text style={{color:"white",fontWeight:"bold"}}>Write a report</Text>
      </TouchableOpacity>
        <View style={styles.featureButtons}>
        <TouchableOpacity>
          <Ionicons name="search" size={32} style={styles.featureButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="filter" size={32} style={styles.featureButtonIcon} />
        </TouchableOpacity>
      </View>
      </View>

      {/* Complaints List */}
      <View style={styles.complaintsContainer}>
        {complaints.map((complaint) => (
          <TouchableOpacity
            key={complaint.id}
            onPress={() => navigation.navigate('Detail', { complaintId: complaint.id })}
          >
            <View style={styles.complaintBox}>
              <Ionicons name="document-text" size={50} />
              <Text style={styles.complaintTitle}>{complaint.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  profileSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1877F2', padding: 15 },
  profileIcon: { backgroundColor: '#FFF', height: 90, width: 90, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  profileDetails: { marginLeft: 15, flex: 1 },
  officerText: { color: '#FFF', fontSize: 16, marginBottom: 5, fontWeight:"bold" },
  featureButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  featureButtonIcon: { marginHorizontal: 10 },
  complaintsContainer: { padding: 15 },
  complaintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  complaintTitle: { marginLeft: 15, fontSize: 16, fontWeight: '500' },
  featured_section: { display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', padding: 14 },
  write_button: { backgroundColor: '#1877F2', padding: 10, borderRadius: 6 },
});

export default HomeScreen;
