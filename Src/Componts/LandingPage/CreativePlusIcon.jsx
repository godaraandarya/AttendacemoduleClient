import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FloatingPlusIcon = () => {
    const navigation =useNavigation();
    const onPress=(()=>{
        navigation.navigate("Adddevice")
    })
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={onPress}
        activeOpacity={0.8} // Smooth press effect
      >
        <View style={styles.buttonContent}>
          <Ionicons name="add" size={24} color="#fff" />
          {/* <Text style={styles.buttonLabel}>Add Device</Text> */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D5FEF', // Beautiful vibrant purple-blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    shadowColor: '#5D5FEF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    // Subtle gradient effect would be great here (would require additional library)
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default FloatingPlusIcon;