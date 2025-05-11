import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AttendanceCalendar from './AttendanceCalendar';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2 - 8;

const AttendanceLandingPage = () => {
  const today = new Date().toISOString().split('T')[0]; // Gets today's date as 'YYYY-MM-DD'
  const date = new Date(today); // Parses it as a Date object
  const[username,setusername]=useState('') ; // Placeholder for username
  const year = date.getFullYear(); // Gets current year
  const month = date.getMonth();   // Gets current month (0-indexed, so May = 4)

  const firstDay = new Date(year, month, 2).toISOString().split('T')[0];       // First day of the month
  const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];
  function calculateWorkingHours(checkin, checkout) {
    if (!checkin || !checkout) return '--:--';

    const [checkinH, checkinM, checkinS] = checkin.split(':').map(Number);
    const [checkoutH, checkoutM, checkoutS] = checkout.split(':').map(Number);

    const checkinDate = new Date(0, 0, 0, checkinH, checkinM, checkinS);
    const checkoutDate = new Date(0, 0, 0, checkoutH, checkoutM, checkoutS);

    let diffMs = checkoutDate - checkinDate;
    if (diffMs < 0) return '--:--'; // Handle overnight shift or invalid input

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  const [attendanceStatus, setAttendanceStatus] = useState({
    status: 'Unknown',
    checkIn: '--:--',
    checkOut: '--:--',
    workingHours: '--:--',
  });
  const [stats, setStats] = useState({
    monthlyPresent: 0,
    monthlyAbsent: 0,
    monthlyLeave: 0,
    monthlyWFH: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const fetchAttendance = async () => {
   setLoading(true);
    try {
      console.log('Fetching attendance data...');
      console.log('First Day:', firstDay);
      console.log('Last Day:', lastDay);


      const response = await axios.post(
        'http://192.168.19.154:5000/api/attendance/getFullAttendance',
        {
          userId: 'GA005',
          fromDate: firstDay,
          toDate: lastDay,
          keyword: 'month',
        },
        { timeout: 10000 }
      );

      const responseData = response.data;
      console.log('Attendance Data:', JSON.stringify(responseData));
      setusername(responseData.username || responseData.userId); // Update username based on API response
      // Extract summary for the month (assuming period: "2025-05")
      const summary = responseData.summary?.find(item => item.period === '2025-05') || {};

      // Update stats
      setStats({
        monthlyPresent: summary.present || 0,
        monthlyAbsent: summary.absent || 0,
        monthlyLeave: summary.leave || 0,
        monthlyWFH: summary.work_from_home || 0,
      });

     

    } catch (error) {
      console.error('Error fetching attendance:', error);
      Alert.alert('Error', 'Failed to fetch attendance data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const checkincheckoutcount = async () => {
    const today = new Date().toISOString().split('T')[0];


    const keyword = 'day';
    Alert.alert('Date:', keyword);
    setLoading(true);

    try {
      const payload = {
        userId: 'GA005',
        fromDate: today,
        toDate: today,
        keyword: keyword,
      };
      
      console.log('Payload sent to API:', JSON.stringify(payload));
      
      const response = await axios.post(
        'http://192.168.19.154:5000/api/attendance/getFullAttendance',
        payload,
        { timeout: 10000 }
      );

      console.log('Checkin/Checkout Count Keyword:', keyword);
      const responseData = response.data;
      console.log('Attendance Data:', JSON.stringify(responseData));

      const workingHours = calculateWorkingHours(responseData.checkin, responseData.checkout);

      setAttendanceStatus({
        status: responseData.attendanceStatus || 'Unknown',
        checkIn: responseData.checkin || '--:--',
        checkOut: responseData.checkout || '--:--',
        workingHours,
      });
      

    } catch (error) {
      console.error('Error fetching attendance:', error.message);
      Alert.alert('Error', 'Failed to fetch attendance data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    checkincheckoutcount();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
    checkincheckoutcount();
  };

  const getStatusTheme = (status) => {
    const themes = {
      present: {
        primary: '#10B981',
        secondary: '#ECFDF5',
        gradient: ['#10B981', '#34D399'],
      },
      Absent: {
        primary: '#EF4444',
        secondary: '#FEF2F2',
        gradient: ['#EF4444', '#F87171'],
      },
      Leave: {
        primary: '#F59E0B',
        secondary: '#FFFBEB',
        gradient: ['#F59E0B', '#FBBF24'],
      },
      WFH: {
        primary: '#8B5CF6',
        secondary: '#F5F3FF',
        gradient: ['#8B5CF6', '#A78BFA'],
      },
      default: {
        primary: '#6B7280',
        secondary: '#F3F4F6',
        gradient: ['#6B7280', '#9CA3AF'],
      },
    };
    return themes[status.toLowerCase()] || themes.default;
  };
  const role =  AsyncStorage.getItem('role');
    
  const statusTheme = getStatusTheme(attendanceStatus.status);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {loading && <ActivityIndicator size="large" color={statusTheme.primary} style={styles.loader} />}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {username}</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="notifications" size={22} color={statusTheme.primary} />
        </TouchableOpacity>
      </View>

      {/* Dynamic Status Card */}
      <LinearGradient
        colors={statusTheme.gradient}
        style={[styles.statusCard, { height: 140 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.statusHeader}>
          <View style={[styles.statusBadge, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
            <Icon
              name={
                attendanceStatus.status === 'present'
                  ? 'check-circle'
                  : attendanceStatus.status === 'Absent'
                    ? 'cancel'
                    : attendanceStatus.status === 'Leave'
                      ? 'beach-access'
                      : 'home'
              }
              size={18}
              color="#FFF"
            />
            <Text style={styles.statusText}>{attendanceStatus.status}</Text>
          </View>
          <Text style={styles.statusSubtitle}>Today's Attendance</Text>
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Check In</Text>
            <Text style={styles.timeValue}>{attendanceStatus.checkIn}</Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Check Out</Text>
            <Text style={styles.timeValue}>{attendanceStatus.checkOut}</Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Hours</Text>
            <Text style={styles.timeValue}>{attendanceStatus.workingHours}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
      >
        <View style={[styles.statCard, { backgroundColor: '#ECFDF5' }]}>
          <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.monthlyPresent}</Text>
          <Text style={styles.statLabel}>Present</Text>
          <Icon name="check-circle" size={20} color="#10B981" style={styles.statIcon} />
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FEF2F2' }]}>
          <Text style={[styles.statNumber, { color: '#EF4444' }]}>{stats.monthlyAbsent}</Text>
          <Text style={styles.statLabel}>Absent</Text>
          <Icon name="cancel" size={20} color="#EF4444" style={styles.statIcon} />
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FFFBEB' }]}>
          <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.monthlyLeave}</Text>
          <Text style={styles.statLabel}>Leave</Text>
          <Icon name="beach-access" size={20} color="#F59E0B" style={styles.statIcon} />
        </View>

        <View style={[styles.statCard, { backgroundColor: '#F5F3FF' }]}>
          <Text style={[styles.statNumber, { color: '#8B5CF6' }]}>{stats.monthlyWFH}</Text>
          <Text style={styles.statLabel}>Work From Home</Text>
          <Icon name="home" size={20} color="#8B5CF6" style={styles.statIcon} />
        </View>
      </ScrollView>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
  {[
    { icon: 'face', label: 'Face ID', color: '#6366F1', screen: 'employeeSchema' },
    { icon: 'list-alt', label: 'Attendance', color: '#3B82F6', screen: 'AttendanceInsightsPage' },
    { icon: 'beach-access', label: 'Apply Leave', color: '#10B981', screen: 'LeaveApplication' },
    { icon: 'approval', label: 'Approvals', color: '#8B5CF6', screen: 'ApprovalLeave' },
  ]
    .filter(action => !(role === 'employee' && action.label === 'Face ID'))
    .map((action, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.actionCard, { backgroundColor: `${action.color}10` }]}
        onPress={() => navigation.navigate(action.screen)}
      >
        <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
          <Icon name={action.icon} size={18} color="#FFF" />
        </View>
        <Text style={[styles.actionText, { color: action.color }]}>{action.label}</Text>
      </TouchableOpacity>
    ))}
</View>


      {/* Calendar Section */}
      <View style={styles.calendarHeader}>
        <Text style={styles.sectionTitle}>Attendance Calendar</Text>
        {/* <TouchableOpacity style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: statusTheme.primary }]}>View All</Text>
          <Icon name="chevron-right" size={16} color={statusTheme.primary} />
        </TouchableOpacity> */}
      </View>
      <AttendanceCalendar compact={true} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 6,
  },
  statusSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  timeDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  timeLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  statsScroll: {
    paddingVertical: 8,
  },
  statCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  statIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontWeight: '500',
    fontSize: 14,
    marginRight: 4,
  },
  loader: {
    marginVertical: 16,
  },
});

export default AttendanceLandingPage;