import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simulated auth hook (replace with actual auth context)
const useAuth = () => {
  return {
    user: 'HR_Admin',
    userId: 'GA002',
    role: 'hr'
  };
};

const LeaveApprovalPage = () => {
  const { userId } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending leaves
  useEffect(() => {
    if (!userId) {
      Alert.alert('Error', 'User ID is missing. Please log in again.');
      return;
    }

    const fetchPendingLeaves = async () => {
      setLoading(true);
      const controller = new AbortController();
      try {
        const payload = {};
        const config = {
          headers: {}, // No Authorization header
          timeout: 10000,
          signal: controller.signal,
        };

        console.log('Pending Leaves Request Payload:', JSON.stringify(payload, null, 2));
        console.log('Pending Leaves Request Headers:', JSON.stringify(config.headers, null, 2));

        const response = await axios.post('http://192.168.19.154:5000/api/attendance/pending-leaves', {
          userId: userId,
          role: 'hr',
        }, config);

        console.log('Pending Leaves Response:', JSON.stringify(response.data, null, 2));
        setLeaves(response.data);
      } catch (err) {
        let errorMessage = 'An error occurred while fetching pending leaves.';
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = 'Unauthorized: Please log in again.';
          } else {
            errorMessage = `Server error: ${err.response.status} - ${err.response.data.error || 'Unknown error'}`;
          }
        } else if (err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        } else {
          errorMessage = `Network error: ${err.message}`;
        }
        console.error('Fetch Error:', errorMessage, err);
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingLeaves();

    
  }, [userId]);

  // Handle approve/reject
  const handleLeaveAction = async (leaveId, status) => {
    try {
      

      const payload = {
        leaveId,
        status
      };

      console.log('Action Payload:', JSON.stringify(payload, null, 2));

      const response = await axios.post('http://192.168.19.154:5000/api/attendance/approve-reject-leave', payload, {
        
        timeout: 10000
      });

      console.log('Action Response:', JSON.stringify(response.data, null, 2));

      setLeaves(prevLeaves => prevLeaves.filter(leave => leave.leaveId !== leaveId));

      Alert.alert('Success', `Leave request ${status} successfully!`);
    } catch (err) {
      let errorMessage = 'An error occurred while processing the leave request.';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Unauthorized: Please log in again.';
        } else {
          errorMessage = `Server error: ${err.response.status} - ${err.response.data.error || 'Unknown error'}`;
        }
      } else {
        errorMessage = `Network error: ${err.message}`;
      }
      console.error('Action Error:', errorMessage, err);
      Alert.alert('Error', errorMessage);
    }
  };

  const renderLeaveItem = ({ item }) => (
    <View style={styles.leaveCard}>
      <View style={styles.leaveHeader}>
        <Text style={styles.userName}>{item.username} ({item.userId})</Text>
        <Text style={styles.leaveType}>{item.leaveType}</Text>
      </View>
      <View style={styles.leaveDetails}>
        <MaterialIcons name="calendar-today" size={18} color="#6c63ff" style={styles.icon} />
        <Text style={styles.detailText}>
          {item.fromDate} {item.fromDate !== item.toDate ? `to ${item.toDate}` : ''}
        </Text>
      </View>
      <View style={styles.leaveDetails}>
        <MaterialIcons name="description" size={18} color="#6c63ff" style={styles.icon} />
        <Text style={styles.detailText}>{item.reason}</Text>
      </View>
      <View style={styles.leaveDetails}>
        <MaterialIcons name="phone" size={18} color="#6c63ff" style={styles.icon} />
        <Text style={styles.detailText}>{item.phoneNumber}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => handleLeaveAction(item.leaveId, 'approved')}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleLeaveAction(item.leaveId, 'rejected')}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="gavel" size={28} color="#fff" />
        <Text style={styles.headerText}>Leave Approval</Text>
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#6c63ff" style={styles.loadingIndicator} />
      )}

      <FlatList
        data={leaves}
        renderItem={renderLeaveItem}
        keyExtractor={item => item.leaveId}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending leave requests</Text>
        }
      />
    </View>
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
  listContainer: {
    padding: 20,
  },
  leaveCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
  },
  leaveType: {
    fontSize: 16,
    color: '#6c63ff',
    fontWeight: '500',
  },
  leaveDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingIndicator: {
    margin: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    margin: 20,
  },
});

export default LeaveApprovalPage;