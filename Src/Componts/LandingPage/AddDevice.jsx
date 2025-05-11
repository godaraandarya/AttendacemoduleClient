import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Modal, Alert, Platform, Linking } from 'react-native';
import React, { use, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import axios from 'axios';

const AddDevice = () => {

  useEffect(() => {
    fetchDeviceList()
  .then(() => {
    console.log('Device Name Options:', deviceNameOptions);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  }, []);

  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceuniqueId, setDeviceuniqueId] = useState('');
  const [devicenickname, setDevicenickname] = useState('');
  const [error, setError] = useState(null);
  const handleAddDevice = async () => {
    if (!deviceName || !deviceType || !deviceId || !deviceuniqueId) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const API_URL = 'http://192.168.19.154:5000/api/devices/userbaseddevicesadd';
      console.log('Adding device to:', API_URL);
      const response = await axios.post(API_URL, {
        deviceid: deviceId,
        devicename: deviceName,
        userid: "GA001",
        deviceuniqueid: deviceuniqueId,
        devicenickname: devicenickname || '', // Optional field
      });
      console.log('Add Response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', response.data.message || 'Device added successfully');
        setDeviceName(deviceOptions[0]?.label || '');
        setDeviceType('');
        setDeviceId();
        setDevicenickname('');
        setDeviceuniqueId('');
      } else {
        throw new Error(response.data.message || 'Failed to add device');
      }
    } catch (error) {
      console.error('Error adding device:', error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add device');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (e) => {
    setDeviceId(e.data);
    setScannerVisible(false);
  };

  const requestCameraPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    try {
      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        setScannerVisible(true);
      } else if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          setScannerVisible(true);
        } else {
          showPermissionDeniedAlert();
        }
      } else {
        showPermissionDeniedAlert();
      }
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Error', 'Failed to request camera permission.');
    }
  };

  const showPermissionDeniedAlert = () => {
    Alert.alert(
      'Camera Permission Required',
      'Please enable camera access in your device settings to scan QR codes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
  };

  let deviceNameOptions = []; // Declare outside the function

  const fetchDeviceList = async () => {
    setLoading(true);
    try {
      const API_URL = 'http://192.168.19.154:5000/api/devices/deviceslist';
      console.log('Fetching from:', API_URL);
      const response = await axios.get(API_URL);
      console.log('Response:', response.data);

      if (response.data.success) {
        const options = response.data.devices.map(device => ({
          label: device.devicename,  // "Smart Motor", etc.
          value: device.deviceid,    // "DV001", etc.
          deviceid: device.deviceid  // Corrected to use deviceid
        }));
        setDeviceOptions(options);
       
        
      } else {
        throw new Error(response.data.message || 'Failed to fetch device list');
      }
    } catch (error) {
      console.error('Error fetching device list:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Ionicons name="add-circle-outline" size={30} color="#6C63FF" />
        <Text style={styles.headerText}>Add New Device</Text>
      </View>

      <View style={styles.card}>
  {/* Device Name Picker
  <View style={styles.inputContainer}>
    <Ionicons name="cube-outline" size={24} color="#6C63FF" />
    <Picker
      selectedValue={deviceId} // Use deviceId for unique value
      onValueChange={(value) => {
        const selected = deviceOptions.find(opt => opt.value === value);
        setDeviceId(value);
        setDeviceName(selected?.label || '');
      }}
      style={styles.picker}
      dropdownIconColor="#6C63FF"
    >
      <Picker.Item label="Select a device" value="" />
      {deviceOptions.map((option) => (
        <Picker.Item key={option.value} label={option.label} value={option.value} />
      ))}
    </Picker>
  </View> */}

  {/* Device Type Input */}
  <View style={styles.inputContainer}>
    <Ionicons name="construct-outline" size={24} color="#6C63FF" /> {/* Type/config */}
    <TextInput
      style={styles.input}
      placeholder="Device Type"
      placeholderTextColor="#999"
      value={deviceType}
      onChangeText={setDeviceType}
    />
  </View>

  {/* Device Nickname Input */}
  <View style={styles.inputContainer}>
    <Ionicons name="person-outline" size={24} color="#6C63FF" /> {/* User-defined name */}
    <TextInput
      style={styles.input}
      placeholder="Dispay name" // Kept as per your code
      placeholderTextColor="#999"
      value={devicenickname}
      onChangeText={setDevicenickname}
    />
  </View>

  {/* Device Code Input */}
  <View style={styles.inputContainer}>
    <Ionicons name="barcode-outline" size={24} color="#6C63FF" /> {/* Code/identifier */}
    <TextInput
      style={styles.input}
      placeholder="Device code"
      placeholderTextColor="#999"
      value={deviceId}
      editable={false}
      onChangeText={setDeviceId}
    />
  </View>

  {/* Device Unique ID Input */}
  <View style={styles.inputContainer}>
    <Ionicons name="key-outline" size={24} color="#6C63FF" /> {/* Unique ID */}
    <TextInput
      style={styles.input}
      placeholder="Device ID"
      placeholderTextColor="#999"
      value={deviceuniqueId}
      onChangeText={setDeviceuniqueId}
    />
    <TouchableOpacity onPress={requestCameraPermission} style={styles.qrButton}>
      <Ionicons name="qr-code-outline" size={24} color="#6C63FF" />
    </TouchableOpacity>
  </View>

  {/* Add Button */}
  <TouchableOpacity style={styles.addButton} onPress={handleAddDevice}>
    <Text style={styles.buttonText}>Add Device</Text>
    <Ionicons name="arrow-forward" size={24} color="white" />
  </TouchableOpacity>
</View>

      {/* QR Scanner Modal */}
      <Modal visible={scannerVisible} animationType="slide">
        <View style={styles.scannerContainer}>
          <QRCodeScanner
            onRead={handleQRScan}
            showMarker={true}
            markerStyle={styles.marker}
            cameraStyle={styles.camera}
            topContent={
              <Text style={styles.scannerTitle}>Scan Device QR Code</Text>
            }
            bottomContent={
              <TouchableOpacity style={styles.closeButton} onPress={() => setScannerVisible(false)}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            }
          />
        </View>
      </Modal>

      {/* Tips Section */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Quick Tips</Text>
        {/* <View style={styles.tipItem}>
          <Ionicons name="information-circle-outline" size={20} color="#6C63FF" />
          <Text style={styles.tipText}>Select your device type from the list</Text>
        </View> */}
        <View style={styles.tipItem}>
          <Ionicons name="information-circle-outline" size={20} color="#6C63FF" />
          <Text style={styles.tipText}>Find device ID on the back of your device</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="information-circle-outline" size={20} color="#6C63FF" />
          <Text style={styles.tipText}>Or scan the QR code if available</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#6C63FF',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    elevation: 3,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 4,
    marginBottom: 2,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    flex: 1,
    marginLeft: 12,
    color: '#6C63FF',
  },
  qrButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scannerTitle: {
    fontSize: 18,
    color: 'white',
    margin: 20,
    textAlign: 'center',
  },
  marker: {
    borderColor: '#6C63FF',
    borderRadius: 10,
  },
  camera: {
    height: '70%',
  },
  closeButton: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 8,
    margin: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
  },
});

export default AddDevice;