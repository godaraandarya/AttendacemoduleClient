import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simulated auth hook (replace with actual auth context in production)
const useAuth = () => {
  return {
    user: 'Simran', // Dynamic from auth context
    userId: 'GA002' // Dynamic from auth context
  };
};

const LeaveApplication = async() => {

  const { user, userId } = useAuth(); // Get dynamic user data
  const [formData, setFormData] = useState({  
    leaveType: '',
    startDate: new Date(),
    endDate: new Date(),
    reason: '',
    contact: ''
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [modalState, setModalState] = useState({
    visible: false,
    success: false,
    message: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
  };

  const validateForm = () => {
    if (!formData.leaveType) {
      return 'Please select a leave type.';
    }
    if (!formData.reason.trim()) {
      return 'Please provide a reason for the leave.';
    }
    if (formData.leaveType === 'Other' && formData.reason.trim().length < 3) {
      return 'Please provide a specific reason for "Other" leave type.';
    }
    return null;
  };

  const handleSubmit = async () => {
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }
  
    try {
      const payload = {
       
        userId,
        leaveType: formData.leaveType === 'Other' ? formData.reason.toLowerCase() : formData.leaveType.toLowerCase(),
        fromDate: formatDate(formData.startDate),
        toDate: formatDate(formData.endDate),
        reason: formData.reason,
        phoneNumber: formData.contact,
      };
  
      console.log('Submitting Payload:', JSON.stringify(payload, null, 2));
  
      const response = await axios.post('http://192.168.19.154:5000/api/attendance/applyLeave', payload, {
        timeout: 10000,
      });
  
      console.log('API Response:', JSON.stringify(response.data, null, 2));
  
      Alert.alert(response.data.message || 'Your leave request has been successfully submitted!');
  
      // Reset form after successful submission
      setFormData({
        leaveType: '',
        startDate: new Date(),
        endDate: new Date(),
        reason: '',
        contact: '',
      });
    } catch (err) {
      const errorMessage = err.response
        ? `Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`
        : `Network error: ${err.message}`;
      console.error('Submit Error:', errorMessage, err);
      alert(errorMessage);
    }
  };

  const leaveTypes = [
    { id: 1, name: 'Sick Leave', icon: 'medication' },
    { id: 2, name: 'Vacation', icon: 'leave-bags-at-home' },
    { id: 3, name: 'Personal', icon: 'account-box' },
    { id: 4, name: 'Maternity/Paternity', icon: 'bedroom-child' },
    { id: 5, name: 'Bereavement', icon: 'flourescent' },
    { id: 6, name: 'Other', icon: 'menu-open' },
    { id: 7, name: 'Half-day', icon: 'schedule' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="assignment" size={28} color="#fff" />
        <Text style={styles.headerText}>Leave Application</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Leave Type</Text>
        <View style={styles.leaveTypeContainer}>
          {leaveTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.leaveTypeButton,
                formData.leaveType === type.name && styles.selectedLeaveType
              ]}
              onPress={() => handleChange('leaveType', type.name)}
            >
              <MaterialIcons 
                name={type.icon} 
                size={24} 
                color={formData.leaveType === type.name ? '#6c63ff' : '#666'} 
              />
              <Text 
                style={[
                  styles.leaveTypeText,
                  formData.leaveType === type.name && styles.selectedLeaveTypeText
                ]}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Date Range</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity 
            style={styles.dateInput} 
            onPress={() => setShowStartDatePicker(true)}
          >
            <FontAwesome name="calendar" size={18} color="#6c63ff" />
            <Text style={styles.dateText}>
              {formData.startDate.toDateString()}
            </Text>
          </TouchableOpacity>
          
          <MaterialIcons name="arrow-forward" size={24} color="#666" />
          
          <TouchableOpacity 
            style={styles.dateInput} 
            onPress={() => setShowEndDatePicker(true)}
          >
            <FontAwesome name="calendar" size={18} color="#6c63ff" />
            <Text style={styles.dateText}>
              {formData.endDate.toDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {showStartDatePicker && (
          <DateTimePicker
            value={formData.startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) handleChange('startDate', date);
            }}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={formData.endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) handleChange('endDate', date);
            }}
          />
        )}

        <Text style={styles.sectionTitle}>Reason</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.reason}
          onChangeText={(text) => handleChange('reason', text)}
          placeholder={formData.leaveType === 'Other' ? 'Specify the reason (e.g., Family Emergency)' : 'Briefly explain the reason for leave'}
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="phone" size={18} color="#6c63ff" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData.contact}
            onChangeText={(text) => handleChange('contact', text)}
            placeholder="Contact number while on leave"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Application</Text>
          <AntDesign name="arrowright" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalState.visible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <AntDesign 
                name={modalState.success ? 'checkcircle' : 'closecircle'} 
                size={60} 
                color={modalState.success ? '#4CAF50' : '#dc3545'} 
              />
            </View>
            <Text style={styles.modalTitle}>
              {modalState.success ? 'Application Submitted!' : 'Submission Failed'}
            </Text>
            <Text style={styles.modalText}>
              {modalState.message}
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setModalState({ visible: false, success: false, message: '' })}
            >
              <Text style={styles.modalButtonText}>
                {modalState.success ? 'Done' : 'Try Again'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#6c63ff',
    paddingVertical: 25,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  formContainer: {
    padding: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 15,
    marginTop: 10,
  },
  leaveTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leaveTypeButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedLeaveType: {
    borderWidth: 2,
    borderColor: '#6c63ff',
    backgroundColor: '#f0e7ff',
  },
  selectedLeaveTypeText: {
    color: '#6c63ff',
    fontWeight: '600',
  },
  leaveTypeText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    marginLeft: 10,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LeaveApplication;