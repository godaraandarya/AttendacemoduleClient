import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Using Ionicons for the icons
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo to check network status

const NetworkStatus = () => {

  const [isConnected, setIsConnected] = useState(true); // Network connection status
  const [deviceCount, setDeviceCount] = useState(0); // Device count
  const [iotDevicesConnected, setIotDevicesConnected] = useState(0); 
  const [isEmergency, setIsEmergency] = useState(false); // Emergency status
  // IoT device connection count


  const generateRandomDeviceCount = () => {
    setDeviceCount(Math.floor(Math.random() * 5) + 1); // Random devices between 1 and 5
  };


  const generateRandomIotDevices = () => {
    setIotDevicesConnected(Math.floor(Math.random() * 10) + 1); // Random IoT devices between 1 and 10
  };


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected); // Set network status based on connection
    });

    const interval = setInterval(() => {
      generateRandomDeviceCount();
      generateRandomIotDevices();
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Icon
              name={isConnected ? "wifi" : "wifi-off"}
              size={30}
              color={isConnected ? "#4caf50" : "#f44336"} // Green for online, Red for offline
            />
            <Text style={styles.text}>{isConnected ? 'Online' : 'Offline'}</Text>
          </View>

          <View style={styles.separator} />


          <View style={styles.statusItem}>
            <Icon
              name="bulb"
              size={30}
              color={deviceCount > 0 ? "#ff9800" : "#9e9e9e"} // Blue if device count > 0
            />
            <Text style={styles.text}>{deviceCount} Devices</Text>
          </View>

          {/* Vertical separator line */}
          <View style={styles.separator} />

          
       

        <View style={styles.statusItem}>
          <Icon
            name="warning"
            size={30}
            color={isEmergency ? "#d32f2f" : "#9e9e9e"} // Red if emergency, gray if normal
          />
          <Text style={styles.text}>
            {isEmergency ? "Emergency!" : "Normal"}
          </Text>
        </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    // flex: 1,
    // padding: 10,
  },
  box: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 15,
    width: '100%',
    elevation: 5, // for shadow effect (Android)
    shadowColor: '#000', // for shadow (iOS)
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  statusContainer: {
    flexDirection: 'row',  // Align items horizontally
    justifyContent: 'space-around', // Distribute space between items
    width: '100%',
  },
  statusItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    flexDirection: 'column',  // Stack icon and text vertically
  },
  separator: {
    borderLeftWidth: 1,
    borderColor: '#ddd', // Light grey color for the separator
    height: 60,  // Adjust the height based on your content
    marginHorizontal: 10,
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default NetworkStatus;
