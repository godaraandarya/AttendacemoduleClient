import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({navigation}) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = React.useState(true);

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Profile Card */}
      <View style={[styles.profileCard, isDarkMode && styles.darkCard]}>
        <Image 
          source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, isDarkMode && styles.darkText]}>Sarah Johnson</Text>
          <Text style={[styles.profileEmail, isDarkMode && styles.darkSubText]}>sarah.johnson@example.com</Text>
          <TouchableOpacity style={[styles.editButton, isDarkMode && styles.darkEditButton]}>
            <Text style={[styles.editButtonText, isDarkMode && styles.darkEditText]}>Edit Profile</Text>
            <MaterialIcons name="edit" size={16} color={isDarkMode ? '#fff' : '#555'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Options */}
      <View style={[styles.settingsSection, isDarkMode && styles.darkCard]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Preferences</Text>
        
        <TouchableOpacity style={styles.optionItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#FF9F43' }]}>
            <Ionicons name="notifications" size={20} color="#fff" />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Notifications</Text>
          <Switch
            value={isNotificationEnabled}
            onValueChange={() => setIsNotificationEnabled(!isNotificationEnabled)}
            thumbColor={isNotificationEnabled ? '#FF9F43' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#FF9F4350' }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#6C5CE7' }]}>
            <Ionicons name="moon" size={20} color="#fff" />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(!isDarkMode)}
            thumbColor={isDarkMode ? '#6C5CE7' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#6C5CE750' }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#00CEc9' }]}>
            <FontAwesome name="language" size={20} color="#fff" />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Language</Text>
          <Text style={[styles.optionValue, isDarkMode && styles.darkSubText]}>English</Text>
          <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#aaa' : '#999'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.settingsSection, isDarkMode && styles.darkCard]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Account</Text>
        
        <TouchableOpacity style={styles.optionItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#FD79A8' }]}>
            <Ionicons name="lock-closed" size={20} color="#fff" />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Privacy</Text>
          <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#aaa' : '#999'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#55E6C1' }]}>
            <Ionicons name="shield-checkmark" size={20} color="#fff" />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Security</Text>
          <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#aaa' : '#999'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#FDA7DF' }]}>
            <Ionicons name="card" size={20} color="#fff" />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Payment Methods</Text>
          <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#aaa' : '#999'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.settingsSection, isDarkMode && styles.darkCard]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Support</Text>
        
        <TouchableOpacity
        style={styles.optionItem}
        onPress={() => navigation.navigate('HelpCenterScreen')}
      >
        <View style={[styles.iconContainer, { backgroundColor: '#FDCB6E' }]}>
          <Ionicons name="help-circle" size={20} color="#fff" />
        </View>
        <Text style={[styles.optionText, isDarkMode && styles.darkText]}>
          Help Center
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={isDarkMode ? '#aaa' : '#999'}
        />
      </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#74B9FF' }]}>
            <Ionicons name="document-text" size={20} color="#fff" />
          </View>
          <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Terms & Privacy</Text>
          <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#aaa' : '#999'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={() =>{ navigation.navigate('Login')
          AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }}>
          <View style={[styles.iconContainer, { backgroundColor: '#FF7675' }]}>
            <Ionicons name="log-out" size={20} color="#fff" />
          </View>
          <Text style={[styles.optionText, { color: '#FF7675' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  darkCard: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#6C5CE7',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  profileEmail: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  darkSubText: {
    color: '#aaa',
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkEditButton: {
    backgroundColor: '#333',
  },
  editButtonText: {
    color: '#555',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 5,
  },
  darkEditText: {
    color: '#ddd',
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  optionValue: {
    fontSize: 14,
    color: '#777',
    marginRight: 5,
  },
});

export default SettingsScreen;