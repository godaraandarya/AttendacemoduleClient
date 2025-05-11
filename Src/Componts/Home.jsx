import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome icons

function Home({ navigation,route  }) {
    const { appStyles } = route.params;
        
  return (
    <View style={styles.container}>
      {/* Logo */}
      {/* <Image 
        source={require('./path_to_your_logo.png')} // Make sure you have a logo image in your project directory
        style={styles.logo}
      /> */}
      
      <Text style={styles.title}>Welcome to G & A Intelli's</Text>
      
      {/* Sign In and Sign Up buttons */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Additional Sign Up Options */}
      <Text style={styles.orText}>or sign up with</Text>

      {/* Google Login Button with Icon */}
      <TouchableOpacity style={styles.socialButton}>
        <Icon name="google" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialButtonText}>Google</Text>
      </TouchableOpacity>

      {/* Facebook Login Button with Icon */}
      <TouchableOpacity style={styles.socialButton}>
        <Icon name="facebook" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialButtonText}>Facebook</Text>
      </TouchableOpacity>

      {/* Email Login Button with Icon */}
      <TouchableOpacity style={styles.socialButton}>
        <Icon name="envelope" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.socialButtonText}>Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  orText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginVertical: 20,
  },
  socialButton: {
    backgroundColor: '#e74c3c',  // Red for Google, change for other social media
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,  // Space between icon and text
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Home;
