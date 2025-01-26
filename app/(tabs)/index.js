import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as ScreenCapture from 'expo-screen-capture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReportDetails from '../../src/screens/ReportDetails.js';
import WriteReport from '../../src/screens/WriteReport.js';
import Login from '../../src/screens/Login.js';
import AddMoreDetail from '../../src/screens/AddMoreDetail.js';
import HomeScreen from '../../src/screens/Home.js';
import SpeechToText from "../../src/screens/SpeechToText.js";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const enableScreenProtection = async () => {
    //   try {
    //     await ScreenCapture.preventScreenCaptureAsync();
    //   } catch (error) {
    //     console.error("Failed to disable screen capture:", error);
    //   }
    // };

    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setIsLoggedIn(true);
        } else {
          console.log("User not logged in.");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log("Error checking login status:", error);
      } finally {
        setLoading(false);
      }
    };

    // enableScreenProtection();
    checkLoginStatus();

    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1877F2" />
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "Home" : "Login"}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1877F2',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={ReportDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Write" component={WriteReport} options={{ headerShown: false }} />
        <Stack.Screen name="Add More" component={AddMoreDetail} options={{ headerShown: false }} />
        <Stack.Screen name="Speech" component={SpeechToText} options={{ headerShown: false }} />
      </Stack.Navigator>
    </View>
  );
}
