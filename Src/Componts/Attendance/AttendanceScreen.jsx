import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';

const instructions = [
  'Look straight into the camera',
  'Tilt your head slightly to the right',
  'Now, tilt to the left',
  'Smile softly 😊',
  'Neutral face for ID photo',
];

const AttendanceScreen = () => {
  const { name, userid } = useSelector((state) => state.user);
  const camera = useRef(null);
  const device = useCameraDevice('front');
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    employeeId: '',
    age: '',
    gender: '',
    address: '',
    workLocation: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission !== 'authorized') {
        Alert.alert('Permission Denied', 'Camera access is required.');
      }
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
      }
    })();
  }, []);

  const handleFormChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validateForm = () => {
    const { name, designation, employeeId, age, gender, workLocation } = formData;
    if (!name || !designation || !employeeId || !age || !gender || !workLocation) {
      return false;
    }
    if (isNaN(age) || age <= 0) {
      return false;
    }
    return true;
  };

  const submitForm = () => {
    if (validateForm()) {
      setIsFormValid(true);
      Alert.alert('Success', 'Form submitted. You can now take photos.');
    } else {
      Alert.alert('Error', 'Please fill all required fields with valid data.');
    }
  };

  const captureNextPhoto = async () => {
    if (!camera.current) return;
    try {
      const photo = await camera.current.takePhoto();
      const photoPath = `file://${photo.path}`;
      setCapturedPhotos([...capturedPhotos, photoPath]);

      await CameraRoll.save(photoPath, { type: 'photo' });

      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        setCameraVisible(false);
        Alert.alert('Success', 'All 5 photos captured and saved!');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Photo capture failed');
    }
  };

  const startCapture = () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please submit the form first.');
      return;
    }
    setCapturedPhotos([]);
    setCurrentStep(0);
    setCameraVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>🧑‍💼 Guided Attendance Selfie</Text>

      {/* Form */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Your Information</Text>
        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor="#999"
            value={name}
            onChangeText={(text) => handleFormChange('name', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="work" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Designation *"
            placeholderTextColor="#999"
            value={formData.designation}
            onChangeText={(text) => handleFormChange('designation', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="badge" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Employee ID *"
            placeholderTextColor="#999"
            value={formData.employeeId}
            onChangeText={(text) => handleFormChange('employeeId', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="cake" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Age *"
            placeholderTextColor="#999"
            value={formData.age}
            keyboardType="numeric"
            onChangeText={(text) => handleFormChange('age', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="transgender" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            placeholderTextColor="#999"
            value={formData.gender}
            onChangeText={(text) => handleFormChange('gender', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="work" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Work Location"
            placeholderTextColor="#999"
            value={formData.workLocation}
            onChangeText={(text) => handleFormChange('workLocation', text)}
          />
        </View>
      
        <View style={styles.inputContainer}>
          <Icon name="home" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Address (Optional)"
            placeholderTextColor="#999"
            value={formData.address}
            onChangeText={(text) => handleFormChange('address', text)}
          />
        </View>
      

        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={submitForm}>
          <Text style={styles.buttonText}>Submit Details</Text>
          <Icon name="check-circle" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Take Photos Button */}
      <TouchableOpacity
        style={[styles.button, styles.photoButton, !isFormValid && styles.disabledButton]}
        onPress={startCapture}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>
          {capturedPhotos.length === 5 ? 'Retake Photos' : 'Take Photos'}
        </Text>
      </TouchableOpacity>

      {/* User Details Display */}
      {isFormValid && (
        <View style={styles.userDetails}>
          <Text style={styles.sectionTitle}>👤 User Details</Text>
          <Text style={styles.detailText}>Name: {formData.name}</Text>
          <Text style={styles.detailText}>Designation: {formData.designation}</Text>
          <Text style={styles.detailText}>Employee ID: {formData.employeeId}</Text>
          <Text style={styles.detailText}>Age: {formData.age}</Text>
          <Text style={styles.detailText}>Gender: {formData.gender}</Text>
          {formData.address && <Text style={styles.detailText}>Address: {formData.address}</Text>}
          <Text style={styles.detailText}>Work Location: {formData.workLocation}</Text>
        </View>
      )}

      {/* Captured Photos Preview */}
      {capturedPhotos.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>📷 Your Captured Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewScroll}>
            {capturedPhotos.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.previewImage} />
            ))}
          </ScrollView>
        </>
      )}

      {/* Camera Modal */}
      <Modal visible={isCameraVisible} animationType="slide">
        <View style={styles.cameraContainer}>
          {device ? (
            <>
              <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
              />
              <View style={styles.overlay} />
              <Text style={styles.instructionText}>
                📌 {instructions[currentStep]}
              </Text>
              <TouchableOpacity style={styles.captureButton} onPress={captureNextPhoto}>
                <Text style={styles.captureText}>📸 Capture {currentStep + 1}/5</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>Loading Camera...</Text>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f3f6',
    padding: 20,
    paddingTop: 60,
  },
  headerText: {
    fontSize: 24,
    color: '#2d3436',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingRight: 10,
    color: '#2d3436',
  },
  picker: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    paddingVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#0984e3',
  },
  photoButton: {
    backgroundColor: '#0984e3',
  },
  disabledButton: {
    backgroundColor: '#b0bec5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  userDetails: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#2d3436',
    marginBottom: 5,
  },
  previewScroll: {
    maxHeight: 120,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#0984e3',
  },
  captureText: {
    color: '#0984e3',
    fontWeight: 'bold',
    fontSize: 16,
  },
  instructionText: {
    position: 'absolute',
    top: 80,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    color: '#2d3436',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
  },
});

export default AttendanceScreen;