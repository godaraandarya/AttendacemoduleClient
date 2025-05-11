import { StyleSheet, View, Text, Animated, Alert } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Weather from './Weather';
import NetworkStatus from '../NetworkStatus/NetworkStatus';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Added axios import
import { setemail, setIsLoggedIn, setname, setphoneno, setToken, setUserInfo } from '../../redux/UserReducer';

const API_URL = 'http://192.168.19.154:5000/api/login';
const Landingpage = ({navigation}) => {
  const dispatch = useDispatch();
  const { name, userid } = useSelector((state) => state.user);
  const displayName = name || userid || 'Guest';
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    onPressLogin();
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressLogin = async () => {
    try {
      // Get credentials from AsyncStorage
      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');

      if (!email || !password) {
        Alert.alert('Error', 'No saved credentials found');
        return;
      }

      const response = await axios.post(API_URL, {
        email,
        password,
      });

      console.log('Login response:', JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        

        // Update Redux store
        dispatch(setUserInfo(response.data.formattedId));
        dispatch(setToken(response.data.token));
        dispatch(setIsLoggedIn(true));
        dispatch(setemail(response.data.email));
        dispatch(setname(response.data.name));
        dispatch(setphoneno(response.data.phoneno));

        
      } else {
       
      }
    } catch (error) {
      console.error('Login Error:', JSON.stringify(error, null, 2));
     
    }
  };

  return (
    <View style={styles.container}>
      {displayName === "Guest" ? (
        Alert.alert(
          'Login Required',
          'Please log in to access your smart things.',
          [
            {
              text: 'LOGIN',
              onPress: () => navigation.navigate('Login'),
            },
          ],
        )
      ) : (
        <>
          <Animated.Text style={[styles.welcomeText, { transform: [{ scale: scaleAnim }] }]}>
            Hey {displayName}, rule your smart things! 🛠️
          </Animated.Text>
          <NetworkStatus />
          <Weather />
        </>
      )}
    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F4F8',
    padding: 20,
    flex: 0,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6C63FF',
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 15,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
});

export default Landingpage;