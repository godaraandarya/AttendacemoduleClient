import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import email from 'react-native-email';
import LinearGradient from 'react-native-linear-gradient';
import ProfessionalPhotoCapture from './Attendance/PhotoCaptureS3';

const API_BASE_URL = 'http://192.168.19.154:5000/api';
const API_URL = `${API_BASE_URL}/signup`;

const { width, height } = Dimensions.get('window');

const employeeSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  department: Yup.string()
    .min(2, 'Department must be at least 2 characters')
    .required('Department is required'),
  employeeId: Yup.string()
    .min(4, 'Employee ID must be at least 4 characters')
    .required('Employee ID is required'),
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .required('Address is required'),
  gender: Yup.string()
    .oneOf(['male', 'female'], 'Gender must be Male or Female')
    .required('Gender is required'),
  role: Yup.string()
    .oneOf(
      ['employee', 'teamLead', 'manager', 'hr', 'admin', 'ceo', 'super admin'],
      'Invalid role'
    )
    .required('Role is required'),
});

const roleOptions = [
  { label: 'Employee', value: 'employee', icon: 'people-outline', color: '#4CAF50' },
  { label: 'Team Lead', value: 'teamLead', icon: 'ribbon-outline', color: '#2196F3' },
  { label: 'Manager', value: 'manager', icon: 'briefcase-outline', color: '#673AB7' },
  { label: 'HR', value: 'hr', icon: 'heart-circle-outline', color: '#E91E63' },
  { label: 'Admin', value: 'admin', icon: 'shield-checkmark-outline', color: '#FF5722' },
  { label: 'CEO', value: 'ceo', icon: 'trophy-outline', color: '#FFC107' },
  { label: 'Super Admin', value: 'super admin', icon: 'star-outline', color: '#9C27B0' },
];

const AddEmployeeScreen = ({ route }) => {
  const navigation = useNavigation();
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [data, setData] = useState(null);
  const [animation] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Fetch user data on mount
  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        setFetching(true);
        const id = await AsyncStorage.getItem('id');
        const token = await AsyncStorage.getItem('userToken');

        if (!id || !token) {
          Alert.alert('Error', 'Please log in again.');
          if (isMounted) navigation.navigate('Login');
          return;
        }
        console.log(`${API_BASE_URL}/user/${id}`);

        const response = await fetch(`${API_BASE_URL}/user/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            Alert.alert('Session Expired', 'Please log in again.');
            await AsyncStorage.removeItem('userToken');
            if (isMounted) navigation.navigate('Login');
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success && isMounted) {
          setData(result);
        } else {
          throw new Error(result.message || 'Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (isMounted) {
          Alert.alert('Error', error.message || 'Failed to fetch user data.');
        }
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [navigation]);

  const toggleRolePicker = () => {
    if (showRolePicker) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowRolePicker(false));
    } else {
      setShowRolePicker(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  // Callback to receive photos from ProfessionalPhotoCapture
  const handlePhotosReceived = (newPhotos) => {
    setPhotos(newPhotos);
    Alert.alert(
      'Photos Received',
      `Received ${newPhotos.length} photo(s)`,
      [{ text: 'OK' }]
    );
    
    
  };
  const handleclickSubmit = async () => {
    try {

      navigation.navigate('PhotoCapture', {
        onPhotosSubmit: handlePhotosReceived,
      });

    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const handleAddEmployee = async (values, { resetForm, setFieldValue }) => {
    if (!data) {
      Alert.alert('Error', 'User data not loaded. Please try again.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        systemEmail: values.email,
        phoneNumber: values.phoneNumber,
        password: uuid.v4().split('-')[0],
        systemName: data.Organizationsname,
        systemType: values.department,
        OrganizationsId: data.OrganizationsId,
        address: values.address,
        companyid: values.employeeId,
        role: values.role,
        contactPerson: values.phoneNumber,
        gender: values.gender,
        photos: photos.map((file) => ({
          fileName: file.fileName,
          fileType: file.fileType,
        })),
      };

      console.log("Payload:", payload);
      
      const response = await axios.post(API_URL, payload);
      console.log('API Response:', response.data);

      if (response.data?.success) {
        const { photosUrl, meta_url } = response.data;

        // Upload photos to S3
        for (let i = 0; i < photos.length; i++) {
          const { uri, fileType, fileName } = photos[i];
          const { uploadUrl } = photosUrl[i];
          if (!Array.isArray(photosUrl) || !Array.isArray(meta_url)) {
            Alert.alert('Error', 'Upload URLs missing in response.');
            return;
          }
          const file = {
            uri,
            type: fileType,
            name: fileName,
          };

          const formData = new FormData();
          formData.append('file', file);

          try {
            const imageBlob = await fetch(uri).then(res => res.blob());
            const uploadResponse = await axios.put(uploadUrl, imageBlob, {
              headers: {
                'Content-Type': fileType,
              },
            });

            console.log(`Uploaded image ${fileName} to S3:`, uploadResponse.status);
          } catch (error) {
            console.error(`Error uploading image ${fileName}:`, error);
            Alert.alert('Error', `Failed to upload image ${fileName}. Please try again.`);
          }
        }

        // Upload metadata to S3
        for (let i = 0; i < meta_url.length; i++) {
          try {
            await axios.put(meta_url[i], JSON.stringify(meta), {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log(`Metadata uploaded to: ${meta_url[i]}`);
          } catch (error) {
            console.error(`Error uploading metadata to ${meta_url[i]}:`, error);
            Alert.alert('Error', `Failed to upload metadata for image ${i + 1}.`);
          }
        }

        // Success alert and redirect
        Alert.alert('Success', 'Employee added successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('EmployeeList') },
        ]);
      }

    } catch (error) {
      console.error('Error adding employee:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add employee. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };


  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.5, 0],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {fetching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading Organization Data...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Formik
              initialValues={{
                employeeId: '',
                name: '',
                email: '',
                phoneNumber: '',
                department: '',
                address: '',
                role: '',
                gender: '',
              }}
              validationSchema={employeeSchema}
              onSubmit={handleAddEmployee}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <View style={styles.formContainer}>
                  {/* Header Section */}
                  <View style={styles.header}>
                    <Animated.View
                      style={[
                        styles.logoContainer,
                        {
                          transform: [
                            {
                              rotate: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg'],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={['#6a11cb', '#2575fc']}
                        style={styles.gradientCircle}
                      >
                        <Fontisto
                          name={
                            values.gender
                              ? values.gender === 'male'
                                ? 'male'
                                : 'female'
                              : 'person'
                          }
                          size={36}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                    </Animated.View>
                    <Text style={styles.title}>New Employee Onboarding</Text>
                    <Text style={styles.subtitle}>
                      Complete the form to welcome a new team member
                    </Text>
                  </View>

                  {/* Form Sections */}
                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    {/* Gender Selection */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Gender</Text>
                      <View style={styles.radioContainer}>
                        <TouchableOpacity
                          style={[
                            styles.radioButton,
                            values.gender === 'male' && styles.radioButtonSelected,
                          ]}
                          onPress={() => setFieldValue('gender', 'male')}
                        >
                          <Fontisto
                            name="male"
                            size={18}
                            color={values.gender === 'male' ? '#fff' : '#2575fc'}
                          />
                          <Text
                            style={[
                              styles.radioText,
                              values.gender === 'male' && styles.radioTextSelected,
                            ]}
                          >
                            Male
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.radioButton,
                            values.gender === 'female' && styles.radioButtonSelected,
                          ]}
                          onPress={() => setFieldValue('gender', 'female')}
                        >
                          <Fontisto
                            name="female"
                            size={18}
                            color={values.gender === 'female' ? '#fff' : '#e91e63'}
                          />
                          <Text
                            style={[
                              styles.radioText,
                              values.gender === 'female' && styles.radioTextSelected,
                            ]}
                          >
                            Female
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {touched.gender && errors.gender && (
                        <Text style={styles.errorText}>{errors.gender}</Text>
                      )}
                    </View>

                    {/* Name */}
                    <InputField
                      icon={<Ionicons name="person-outline" size={22} color="#6a11cb" />}
                      label="Full Name"
                      placeholder="John Doe"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      error={touched.name && errors.name}
                    />

                    {/* Employee ID */}
                    <InputField
                      icon={<MaterialCommunityIcons name="card-account-details" size={22} color="#2575fc" />}
                      label="Employee ID"
                      placeholder="EMP-1234"
                      value={values.employeeId}
                      onChangeText={handleChange('employeeId')}
                      onBlur={handleBlur('employeeId')}
                      error={touched.employeeId && errors.employeeId}
                    />
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>

                    {/* Email */}
                    <InputField
                      icon={<MaterialIcons name="email" size={22} color="#e91e63" />}
                      label="Email Address"
                      placeholder="john.doe@company.com"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={touched.email && errors.email}
                      keyboardType="email-address"
                    />

                    {/* Phone */}
                    <InputField
                      icon={<MaterialIcons name="phone" size={22} color="#4CAF50" />}
                      label="Phone Number"
                      placeholder="9876543210"
                      value={values.phoneNumber}
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      error={touched.phoneNumber && errors.phoneNumber}
                      keyboardType="phone-pad"
                    />

                    {/* Address */}
                    <InputField
                      icon={<MaterialIcons name="location-on" size={22} color="#FF5722" />}
                      label="Address"
                      placeholder="123 Main St, City, Country"
                      value={values.address}
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      error={touched.address && errors.address}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Professional Information</Text>

                    {/* Department */}
                    <InputField
                      icon={<Fontisto name="building" size={20} color="#673AB7" />}
                      label="Department"
                      placeholder="Engineering"
                      value={values.department}
                      onChangeText={handleChange('department')}
                      onBlur={handleBlur('department')}
                      error={touched.department && errors.department}
                    />

                    {/* Role Picker */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Role</Text>
                      <TouchableOpacity
                        style={[
                          styles.rolePicker,
                          errors.role && touched.role ? styles.inputError : null,
                        ]}
                        onPress={toggleRolePicker}
                        activeOpacity={0.8}
                      >
                        <View style={styles.rolePickerContent}>
                          <Ionicons
                            name={selectedRole?.icon || 'briefcase-outline'}
                            size={22}
                            color={selectedRole ? selectedRole.color : '#a5b1c2'}
                          />
                          <Text
                            style={[styles.rolePickerText, !selectedRole && { color: '#a5b1c2' }]}
                          >
                            {selectedRole?.label || 'Select Role'}
                          </Text>
                        </View>
                        <Entypo
                          name={showRolePicker ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color="#a5b1c2"
                        />
                      </TouchableOpacity>
                      {errors.role && touched.role && (
                        <Text style={styles.errorText}>{errors.role}</Text>
                      )}
                    </View>

                    {/* Photo Capture */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Employee Photo</Text>
                      <TouchableOpacity
                        onPress={handleclickSubmit}
                        style={styles.photoButton}
                      >
                        <View style={styles.photoButtonContent}>
                          <MaterialIcons name="add-a-photo" size={22} color="#FFFFFF" />
                          <Text style={styles.photoButtonText}>
                            {values.photo ? 'Change Photo' : 'Add Employee Photo'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[styles.registerButton, submitting && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={submitting}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#6a11cb', '#2575fc']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {submitting ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <View style={styles.buttonContent}>
                          <MaterialIcons name="person-add" size={22} color="#fff" />
                          <Text style={styles.registerButtonText}>Complete Onboarding</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Role Picker Modal */}
                  <Modal
                    visible={showRolePicker}
                    transparent
                    animationType="none"
                    onRequestClose={toggleRolePicker}
                  >
                    <TouchableWithoutFeedback onPress={toggleRolePicker}>
                      <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    <Animated.View style={[styles.rolePickerModal, { transform: [{ translateY }] }]}>
                      <Text style={styles.rolePickerTitle}>Select Employee Role</Text>
                      <ScrollView>
                        {roleOptions.map((role) => (
                          <TouchableOpacity
                            key={role.value}
                            style={[
                              styles.roleOption,
                              selectedRole?.value === role.value && styles.selectedRoleOption,
                            ]}
                            onPress={() => {
                              setSelectedRole(role);
                              setFieldValue('role', role.value);
                              toggleRolePicker();
                            }}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={role.icon}
                              size={24}
                              color={selectedRole?.value === role.value ? '#fff' : role.color}
                            />
                            <Text
                              style={[
                                styles.roleOptionText,
                                selectedRole?.value === role.value && styles.selectedRoleOptionText,
                              ]}
                            >
                              {role.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </Animated.View>
                  </Modal>
                </View>
              )}
            </Formik>
          </ScrollView>
        )}
      </KeyboardAvoidingView>

    </Animated.View>
  );
};

const InputField = ({
  icon,
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View
      style={[
        styles.inputWrapper,
        error ? styles.inputError : null,
        multiline && styles.multiline,
      ]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <TextInput
        style={[styles.input, multiline && styles.addressText]}
        placeholder={placeholder}
        placeholderTextColor="#a5b1c2"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },

  keyboardContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 15,
    fontSize: 16,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    paddingTop: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  gradientCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.3)',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
    maxWidth: '80%',
    opacity: 0.9,
  },
  formContainer: {
    // backgroundColor: 'rgba(255,255,255,0.9)',
    // borderRadius: 20,
    // padding: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 8,
    // elevation: 5,
  },
  formSection: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    // paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6a11cb',
    marginBottom: 15,
    paddingLeft: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF5252',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#F5F5F5',
  },
  radioButtonSelected: {
    backgroundColor: '#6a11cb',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },
  radioTextSelected: {
    color: '#FFFFFF',
  },
  rolePicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rolePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rolePickerText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
    fontWeight: '500',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: '#6a11cb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 17,
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  addressText: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  multiline: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  rolePickerModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  rolePickerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6a11cb',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
  },
  selectedRoleOption: {
    backgroundColor: '#6a11cb',
  },
  roleOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
  },
  selectedRoleOptionText: {
    color: '#FFFFFF',
  },
  photoButton: {
    backgroundColor: '#6a11cb',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  photoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AddEmployeeScreen;