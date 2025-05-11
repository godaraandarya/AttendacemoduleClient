import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import GetLocation from 'react-native-get-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Weather = () => {
  const { userid, notificationsEnabled } = useSelector((state) => state.user);  const navigation=useNavigation();
  const [address, setAddress] = useState("");
  const [weather, setWeather] = useState("");
  const [icon, setIcon] = useState("");
  const [time, setTime] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [backgroundIcon, setBackgroundIcon] = useState("sunny");
  const [deviceCount] = useState(5); // You might want to make this dynamic

  useEffect(() => {
   
    GetLocationvalue();
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours >= 5 && hours < 12) {
      setTimeOfDay('morning');
      setBackgroundIcon('sunny');
    } else if (hours >= 12 && hours < 17) {
      setTimeOfDay('afternoon');
      setBackgroundIcon('sunny');
    } else if (hours >= 17 && hours < 20) {
      setTimeOfDay('evening');
      setBackgroundIcon('sunset');
    } else {
      setTimeOfDay('night');
      setBackgroundIcon('moon');
    }
    
    setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const GetLocationvalue = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      const { latitude, longitude } = location;
      fetchAddress(latitude, longitude);
      fetchWeather(latitude, longitude);
    } catch (error) {
      const { code, message } = error;
      console.warn(code, message);
      Alert.alert("Error", message);
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const shortAddress =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.display_name.split(',')[0] ||
        'Location not available';
      setAddress(shortAddress);
    } catch (error) {
      console.error('Error fetching address:', error);
     
    }
  };

  const fetchWeather = async (latitude, longitude) => {
    const apiKey = 'e8c8896b1d6a6694cee0d1162b2969f7';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const currentTemperature = data.main.temp;
      const weatherCondition = data.weather[0].main.toLowerCase();
      
      setWeather(`${Math.round(currentTemperature)}°C`);
      setIcon(getWeatherIcon(weatherCondition, currentTemperature));
    } catch (error) {
      console.error('Error fetching weather:', error);
      Alert.alert("Error", "Failed to retrieve weather data");
    }
  };

  const getWeatherIcon = (condition, temperature) => {
    const isNight = timeOfDay === 'night';
    
    switch(condition) {
      case 'clear':
        return isNight ? 'moon' : 'sunny';
      case 'clouds':
        if (temperature <= 15) return 'cloudy';
        return 'partly-sunny';
      case 'rain':
        return 'rainy';
      case 'thunderstorm':
        return 'thunderstorm';
      case 'snow':
        return 'snow';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'cloudy';
      default:
        return isNight ? 'moon' : 'sunny';
    }
  };

  const getTimeGreeting = () => {
    switch(timeOfDay) {
      case 'morning': return 'Good Morning';
      case 'afternoon': return 'Good Afternoon';
      case 'evening': return 'Good Evening';
      case 'night': return 'Good Night';
      default: return 'Hello';
    }
  };

  const getBackgroundColor = () => {
    switch(timeOfDay) {
      case 'morning': return '#FFEECC';
      case 'afternoon': return '#FFD28F';
      case 'evening': return '#D4B4FF';
      case 'night': return '#1B263B';
      default: return '#FFFFFF';
    }
  };

  const getTextColor = () => {
    return timeOfDay === 'night' ? '#FFFFFF' : '#333333';
  };

  return (
    <View style={styles.container}>
      {/* Weather Card */}
      <View style={[styles.card, { backgroundColor: getBackgroundColor() }]}>
        <View style={styles.backgroundIconContainer}>
          <Ionicons 
            name={backgroundIcon} 
            size={120} 
            color={timeOfDay === 'night' ? '#FFD700' : '#FF8C00'} 
            style={[styles.backgroundIcon, { opacity: 0.2 }]}
          />
        </View>
        
        <View style={styles.header}>
          <Text style={[styles.greetingText, { color: getTextColor() }]}>{getTimeGreeting()}</Text>
          <TouchableOpacity onPress={GetLocationvalue} style={[styles.refreshButton, { backgroundColor: timeOfDay === 'night' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }]}>
            <Ionicons name="refresh" size={20} color={getTextColor()} />
          </TouchableOpacity>
        </View>

        <View style={styles.weatherMain}>
          <Text style={[styles.timeText, { color: getTextColor() }]}>{time}</Text>
          <Ionicons 
            name={icon} 
            size={60} 
            color={timeOfDay === 'night' ? '#FFD700' : '#FF8C00'} 
            style={styles.weatherIcon}
          />
          <Text style={[styles.temperatureText, { color: getTextColor() }]}>{weather}</Text>
          <View style={styles.locationContainer}>
            <Ionicons 
              name="location" 
              size={16} 
              color={getTextColor()} 
            />
            <Text style={[styles.locationText, { color: getTextColor() }]}>
              {address || 'Locating...'}
            </Text>
          </View>
        </View>
      </View>

      {/* All Devices Card */}
      <TouchableOpacity 
        style={[styles.card, styles.devicesCard]}
        onPress={() => navigation.navigate("employeeSchema")}
      >
        <View style={styles.backgroundIconContainer}>
          <Ionicons 
            name="grid" 
            size={120} 
            color="#888" 
            style={[styles.backgroundIcon, { opacity: 0.1 }]}
          />
        </View>
        
        <View style={styles.header}>
          <Text style={styles.greetingText}>Devices</Text>
          <View style={[styles.refreshButton, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
            <Ionicons name="chevron-forward" size={20} color="#333" />
          </View>
        </View>

        <View style={styles.devicesMain}>
          <Ionicons 
            name="hardware-chip-outline" 
            size={40} 
            color="#6C63FF" 
            style={styles.deviceIcon}
          />
          <Text style={styles.devicesTitle}>All Devices</Text>
          <Text style={styles.devicesCount}>{deviceCount} connected</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  card: {
    width: "48%",
    height: 200,
    justifyContent:"flex-start",
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  devicesCard: {
    backgroundColor: '#F5F5F5',
  },
  backgroundIconContainer: {
    position: 'absolute',
    right: -30,
    top: -30,
    alignItems:"flex-start",
    opacity: 0.2,
  },
  backgroundIcon: {
    width: 120,
    height: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  weatherMain: {
    alignItems: 'center',
    marginVertical: 10,
    zIndex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  weatherIcon: {
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  temperatureText: {
    fontSize: 23,
    fontWeight: '300',
    marginVertical: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  devicesMain: {
    alignItems: 'center',
    marginVertical: 10,
    zIndex: 1,
  },
  deviceIcon: {
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  devicesTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  devicesCount: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
});

export default Weather;