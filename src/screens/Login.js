import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Image } from 'react-native';
import PoliceLogo from '../../assets/images/police_logo.png';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [collarId, setCollarId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!collarId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    try {
      const response = await api.post('/login', { collar_id: collarId, password });
      if (response.data.success) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
  
        Alert.alert('Success', `Welcome, Officer ${collarId}`);
        
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        Alert.alert('Login Failed', 'Invalid collar ID or password.');
      }
    } catch (error) {
      console.log("Error during login:", error.message);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={PoliceLogo}
          style={styles.logo}
        />
        <Text style={{fontSize:24,fontWeight:"bold", letterSpacing:1}}>UK POLICE</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="User ID"
          keyboardType="text"
          value={collarId}
          onChangeText={setCollarId}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  loginButton: {
    backgroundColor: '#1877F2',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  microsoftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F3F3',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  microsoftButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Login;
