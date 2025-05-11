import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import SettingsScreen from './SettingsScreen';
import AnalyticsScreen from './AnalyticsScreen';
import Landingpage from '../LandingPage/Landingpage';
import AttendanceLandingPage from '../Attendance/AttendanceLandingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.buttonInner}>
      {children}
    </View>
  </TouchableOpacity>
);

const CustomHeader = ({ title, navigation }) => {
  const role=AsyncStorage.getItem('role');
  // Alert.alert("role",role);
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerButtons}>
        
      {role === "super admin" && (
  <TouchableOpacity 
    style={styles.headerButton}
    onPress={() => navigation.navigate('Adddevice')}
  >
    <Ionicons name="add" size={25} color="#6C63FF" />
  </TouchableOpacity>
)}
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('NotificationManagerScreen')}>
          <Ionicons name="notifications-outline" size={25} color="#6C63FF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('NewsPage')}>
          <Ionicons name="news" size={25} color="#6C63FF" />
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

function Tabnavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          size = 24; // Unified size for consistency

          if (route.name === 'Home') {
            iconName = focused ? 'home-sharp' : 'home-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings-sharp' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        header: ({ route }) => (
          <CustomHeader title={route.name} navigation={navigation} />
        ),
      })}
    >
      <Tab.Screen name="Home" screenOptions={
        { headerShown: false } // Hide header for the Home tab
      } component={AttendanceLandingPage} />

      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60, // Slightly taller for better touch area
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: '#F0F4F8', // Dark gray
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8, // Enhanced shadow for depth
  },
  label: {
    fontSize: 12, // Slightly larger for readability
    fontWeight: '600',
    marginBottom: 2,
  },
  customButton: {
    top: -25, // Lifted higher for prominence
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    width: 60, // Slightly larger for better touch
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F4F8', // Purple
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10, // Stronger shadow for floating effect
    borderWidth: 2,
    borderColor: '#FFD700', // Gold border for creativity
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:"#F0F4F8",
    height: 65, // Matches headerStyle height
    paddingHorizontal: 20,
    paddingTop: 20, // Accounts for status bar
  
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6C63FF', // Purple title
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 10,
    marginLeft: 10,
  },
  // Removed analyticsIcon since it was redundant with tabBarIcon
});

export default Tabnavigator;