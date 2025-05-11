import React, { useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  useColorScheme,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import dynamicStyles1 from './styles'; // Adjust path
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUserInfo,
  setToken,
  setIsLoggedIn,
  setemail,
  setname,
  setphoneno,
} from '../../redux/UserReducer';

// Validation schema using Yup
const loginSchema = Yup.object().shape({
  // email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const API_URL = 'http://192.168.19.154:5000/api/login';

const LoginScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { appStyles } = route?.params || {};
  const colorScheme = useColorScheme();
  const styles = dynamicStyles1(appStyles || {}, colorScheme);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '866694245157-rpl76iutkr7m8e00v5tad6leq2j5ohak.apps.googleusercontent.com',
    });

    // Check for stored token on mount
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userid = await AsyncStorage.getItem('userid');
        if (token && userid) {
          dispatch(setToken(token));
          dispatch(setUserInfo(userid));
          dispatch(setIsLoggedIn(true));
          navigation.navigate('Landingpage');
        }
      } catch (error) {
        console.error('Error checking login:', error);
      }
    };

    checkLogin();
  }, [dispatch, navigation]);

  const googleSignIn = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;

      // Optionally send Google user data to backend
      const response = await axios.post('http://192.168.19.154:5000/api/google-login', {
        email: user.email,
        name: user.displayName,
      });

      if (response.data.success) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userid', response.data.formattedId);
        await AsyncStorage.setItem('walkthroughCompleted', 'true');

        dispatch(setUserInfo(response.data.formattedId));
        dispatch(setToken(response.data.token));
        dispatch(setIsLoggedIn(true));
        dispatch(setemail(user.email));
        dispatch(setname(user.name));

        navigation.navigate('Landingpage');
        Alert.alert('Success', 'Google Sign-In successful!');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Sign-In was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign-In is already in progress');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const appleSignIn = async () => {
    Alert.alert('Info', 'Apple Sign-In is not fully implemented yet.');
  };

  const onPressLogin = async (values, { setSubmitting }) => {
    try {
      console.log('Login values:', JSON.stringify(values, null, 2));
      console.log('API URL:', API_URL);

      const response = await axios.post(API_URL, {
        email: values.email,
        password: values.password,
      });

      await AsyncStorage.setItem('email', values.email);
      await AsyncStorage.setItem('password', values.password);

      console.log('Login response:', JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userid', response.data.formattedId);
        await AsyncStorage.setItem('walkthroughCompleted', 'true');
        await AsyncStorage.setItem('id', response.data.userId);
        await AsyncStorage.setItem('role', response.data.role);

        
        // Update Redux store
        dispatch(setUserInfo(response.data.formattedId));
        dispatch(setToken(response.data.token));
        dispatch(setIsLoggedIn(true));
        dispatch(setemail(response.data.email));
        dispatch(setname(response.data.name));
        dispatch(setphoneno(response.data.phoneno));
        

        Alert.alert('Success', response.data.message || 'Login successful!');
        navigation.navigate('Landingpage');
      } else {
        Alert.alert('Error', response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onPressSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.title}>Log In</Text>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginSchema}
          onSubmit={onPressLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              <View style={styles.inputContainer}>
                <View style={styles.iconWrapper}>
                  <Icon name="envelope" size={20} color="#ff6f61" />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="E-mail"
                  keyboardType="email-address"
                  placeholderTextColor="#aaa"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  autoCapitalize="none"
                />
              </View>
              {/* {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>} */}

              <View style={styles.inputContainer}>
                <View style={styles.iconWrapper}>
                  <Icon name="lock" size={20} color="#2e8b57" />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderTextColor="#aaa"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  autoCapitalize="none"
                />
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.googleSignUpContainer} onPress={googleSignIn}>
                  <Icon name="google" size={30} color="blue" style={styles.iconStyle} />
                </TouchableOpacity>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity style={styles.googleSignUpContainer} onPress={appleSignIn}>
                    <Icon name="apple" size={30} color="green" style={styles.iconStyle} />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.loginContainer}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>

              {isSubmitting && <ActivityIndicator size="large" color="#0000ff" />}
            </>
          )}
        </Formik>

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={onPressSignUp}>
            <Text style={styles.forgotPasswordText}>
              Don't have an account? <Text style={{ color: 'blue' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginScreen;