import React, { useState } from 'react';
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
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import uuid from 'react-native-uuid';

const attendanceSignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  systemName: Yup.string()
    .min(3, 'System name must be at least 3 characters')
    .required('System name is required'),
  systemType: Yup.string()
    .required('System type is required'),
  systemEmail: Yup.string()
    .email('Invalid email format')
    .required('System email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .required('Address is required'),
  adminId: Yup.string()
    .min(5, 'Organization ID must be at least 5 characters')
    .required('Admin ID is required')
});

const API_URL = 'http://192.168.19.154:5000/api/signup';

const systemTypes = [
  { label: 'School', value: 'school' },
  { label: 'University', value: 'university' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Non-Profit', value: 'non_profit' },
  { label: 'Government', value: 'government' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Training Center', value: 'training_center' },
  { label: 'Other', value: 'other' },
];

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        name: values.name,
        systemName: values.systemName,
        systemType: values.systemType,
        systemEmail: values.systemEmail,
        password: values.password,
        phoneNumber: values.phoneNumber,
        address: values.address,
        companyid: values.adminId,
        role:"super admin",
        contactPerson: values.contactPerson,
        OrganizationsId: uuid.v4(),
        gender:values.gender?"male":"female",
      };
      console.log("hello",JSON.stringify(payload));
      const response = await axios.post(API_URL, payload);

      if (response.data.success) {
        Alert.alert(
          'Registration Successful',
          'Your attendance system account has been created! Our team will review your details and contact you shortly.',
          [
            { text: 'OK', onPress: () => navigation.navigate('Attendace') }
          ]
        );
        
        resetForm();
      } else {
        Alert.alert('Registration Pending', response.data.message || 'Your submission is being reviewed.');
      }
    } catch (error) {
      Alert.alert(
        'Verification Needed',
        error.response?.data?.message || 'We need to verify your system details. Our team will contact you shortly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="calendar-check" size={40} color="#ff6b6b" />
          </View>
          <Text style={styles.title}>Attendance System Signup</Text>
          <Text style={styles.subtitle}>Manage attendance with ease</Text>
        </View>

        <Formik
          initialValues={{
            name: '',
            systemName: '',
            systemType: '',
            systemEmail: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            address: '',
            adminId: '',
            contactPerson: ''
          }}
          validationSchema={attendanceSignupSchema}
          onSubmit={handleSignUp}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
          }) => (
            <View style={styles.formContainer}>
              {/* System Name */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  touched.name && errors.name ? styles.inputError : null
                ]}>
                  <Fontisto name="user-secret" size={20} color="#ff9f43" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor="#a5b1c2"
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                  />
                </View>
                {touched.systemName && errors.systemName && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  touched.systemName && errors.systemName ? styles.inputError : null
                ]}>
                  <MaterialCommunityIcons name="domain" size={20} color="#ff9f43" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Your institution name"
                    placeholderTextColor="#a5b1c2"
                    onChangeText={handleChange('systemName')}
                    onBlur={handleBlur('systemName')}
                    value={values.systemName}
                  />
                </View>
                {touched.systemName && errors.systemName && (
                  <Text style={styles.errorText}>{errors.systemName}</Text>
                )}
              </View>

              {/* System Type */}
              <View style={styles.inputContainer}>
  <View style={[
    styles.inputWrapper,
    touched.systemType && errors.systemType ? styles.inputError : null
  ]}>
    <Fontisto name="nav-icon-grid" size={18} color="#00b894" style={styles.inputIcon} />
    <Picker
      selectedValue={values.systemType}
      onValueChange={(itemValue) => setFieldValue('systemType', itemValue)}
      style={styles.picker}
      dropdownIconColor="#2c3e50"
    >
      <Picker.Item label="Select system type" value="" />
      {systemTypes.map((type) => (
        <Picker.Item key={type.value} label={type.label} value={type.value} />
      ))}
    </Picker>
  </View>
  {touched.systemType && errors.systemType && (
    <Text style={styles.errorText}>{errors.systemType}</Text>
  )}
</View>


              {/* System Email */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  touched.systemEmail && errors.systemEmail ? styles.inputError : null
                ]}>
                  <MaterialIcons name="alternate-email" size={20} color="#6c5ce7" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="official@yourorg.com"
                    placeholderTextColor="#a5b1c2"
                    keyboardType="email-address"
                    onChangeText={handleChange('systemEmail')}
                    onBlur={handleBlur('systemEmail')}
                    value={values.systemEmail}
                    autoCapitalize="none"
                  />
                </View>
                {touched.systemEmail && errors.systemEmail && (
                  <Text style={styles.errorText}>{errors.systemEmail}</Text>
                )}
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  touched.password && errors.password ? styles.inputError : null
                ]}>
                  <MaterialIcons name="lock-outline" size={20} color="#e84393" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="At least 8 characters"
                    placeholderTextColor="#a5b1c2"
                    secureTextEntry={!showPassword}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialIcons 
                      name={showPassword ? "visibility-off" : "visibility"} 
                      size={20} 
                      color="#778ca3" 
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  touched.confirmPassword && errors.confirmPassword ? styles.inputError : null
                ]}>
                  <MaterialIcons name="lock-outline" size={20} color="#e84393" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#a5b1c2"
                    secureTextEntry={!showConfirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialIcons 
                      name={showConfirmPassword ? "visibility-off" : "visibility"} 
                      size={20} 
                         />
                  </TouchableOpacity>
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>


              {/* Phone Number */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  touched.phoneNumber && errors.phoneNumber ? styles.inputError : null
                ]}>
                  <MaterialIcons name="phone" size={20} color="#fdcb6e" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="1234567890"
                    placeholderTextColor="#a5b1c2"
                    keyboardType="phone-pad"
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    value={values.phoneNumber}
                  />
                </View>
                {touched.phoneNumber && errors.phoneNumber && (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                )}
              </View>

              {/* Address */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  styles.addressInput,
                  touched.address && errors.address ? styles.inputError : null
                ]}>
                  <MaterialIcons name="location-on" size={20} color="#55efc4" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.addressText]}
                    placeholder="Full institution address"
                    placeholderTextColor="#a5b1c2"
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    value={values.address}
                    multiline
                    numberOfLines={3}
                  />
                </View>
                {touched.address && errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              {/* Admin ID */}
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper, 
                  touched.adminId   ]}>
                  <MaterialCommunityIcons name="badge-account" size={20} color="#d63031" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="System admin identification(Org-001)"
                    placeholderTextColor="#a5b1c2"
                    onChangeText={handleChange('adminId')}
                    onBlur={handleBlur('adminId')}
                    value={values.adminId}
                  />
                </View>
                {touched.adminId && errors.adminId && (
                  <Text style={styles.errorText}>{errors.adminId}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.registerButton, isSubmitting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.registerButtonText}>Register System</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AttendanceLogin')}>
                  <Text style={styles.loginLink}> Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logoContainer: {
    backgroundColor: '#ffeaa7',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 14,
    color: '#636e72',
  },
  formContainer: {
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#2d3436',
    marginBottom: 2,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50, // <-- increased to ensure text fits
    backgroundColor: '#fff',
  },
  
  picker: {
    flex: 1,
    color: '#2d3436',
    fontSize: 16, // larger font
    paddingVertical: 0, // avoid unnecessary top/bottom padding
    marginVertical: -4, // minor tweak to align text vertically
  },
  
  input: {
    flex: 1,
    height: 45,
    color: '#2d3436',
    fontSize: 14,
  },
  addressInput: {
    height: 90,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  addressText: {
    height: 75,
    textAlignVertical: 'top',
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 8,
  },
  inputError: {
    borderColor: '#ff7675',
  },
  errorText: {
    color: '#ff7675',
    fontSize: 11,
    marginTop: 3,
    marginLeft: 5,
  },
  registerButton: {
    backgroundColor: '#ff6b6b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#a5b1c2',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  loginText: {
    color: '#636e72',
  },
  loginLink: {
    color: '#ff6b6b',
    fontWeight: '600',
  },
});

export default SignUpScreen;