import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      // console.log("Connection type:", state.type);
      // console.log("Is connected:", state.isConnected);
    });
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      // console.log("Initial Connection type:", state.type);
      // console.log("Is initially connected:", state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.statusDot, { backgroundColor: isConnected ? 'green' : 'red' }]} />
      <Text style={[styles.text, { color: isConnected ? 'green' : 'grey' }]}>
        {isConnected ? 'online' : 'offline'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6, // make it circular
    marginRight: 8, // space between the dot and the text
  },
  text: {
    fontSize: 18,
  },
});

export default NetworkStatus;
