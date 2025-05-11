import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { startOfYear, endOfYear, addDays, isSunday, format } from 'date-fns';

const { width } = Dimensions.get('window');

// Simulated auth hook (replace with actual auth context)
const useAuth = () => {
  return {
    userId: 'GA005',
    user: 'Simran',
  };
};

// Fetch public holidays for India (2025)
const fetchPublicHolidays = async (year = 2025, countryCode = 'IN') => {
  try {
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    };
    const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`, config);
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', response.data);
    const holidays = response.data.map(holiday => ({
      date: holiday.date,
      name: holiday.localName,
    }));
    console.log('Fetched holidays:', holidays);
    return holidays;
  } catch (error) {
    let errorMessage = 'Failed to fetch holidays';
    if (error.response) {
      errorMessage = `API error: ${error.response.status} - ${error.response.data}`;
    } else if (error.request) {
      errorMessage = 'No response from API. Check network or server status.';
    } else {
      errorMessage = `Error: ${error.message}`;
    }
    console.error('Error fetching holidays:', errorMessage, error);
    const fallbackHolidays = [
      { date: '2025-01-01', name: "New Year's Day" },
      { date: '2025-01-14', name: 'Makar Sankranti / Pongal' },
      { date: '2025-01-26', name: 'Republic Day' },
      { date: '2025-02-12', name: 'Vasant Panchami' },
      { date: '2025-02-26', name: 'Maha Shivaratri' },
      { date: '2025-03-14', name: 'Holi' },
      { date: '2025-03-31', name: 'Eid al-Fitr' },
      { date: '2025-04-10', name: 'Ram Navami' },
      { date: '2025-04-14', name: 'Baisakhi / Tamil New Year' },
      { date: '2025-04-18', name: 'Good Friday' },
      { date: '2025-04-20', name: 'Easter Sunday' },
      { date: '2025-05-12', name: 'Buddha Purnima' },
      { date: '2025-06-06', name: 'Eid al-Adha' },
      { date: '2025-07-27', name: 'Muharram' },
      { date: '2025-08-15', name: 'Independence Day' },
      { date: '2025-08-16', name: 'Raksha Bandhan' },
      { date: '2025-08-23', name: 'Janmashtami' },
      { date: '2025-09-05', name: 'Ganesh Chaturthi' },
      { date: '2025-10-02', name: 'Gandhi Jayanti' },
      { date: '2025-10-20', name: 'Dussehra (Vijayadashami)' },
      { date: '2025-11-01', name: 'Diwali' },
      { date: '2025-11-05', name: 'Guru Nanak Jayanti' },
      { date: '2025-12-25', name: 'Christmas Day' },
    ];
    console.log('Using fallback holidays:', fallbackHolidays);
    return fallbackHolidays;
  }
};

// Generate Sundays for a given year
const getSundays = (year = 2025) => {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  const sundays = [];
  let currentDate = start;

  while (currentDate <= end) {
    if (isSunday(currentDate)) {
      sundays.push(format(currentDate, 'yyyy-MM-dd'));
    }
    currentDate = addDays(currentDate, 1);
  }

  console.log('Generated Sundays:', sundays.slice(0, 5), '...', `Total: ${sundays.length}`);
  return sundays;
};

const AttendanceCalendar = () => {
  const { userId } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const getAllYearAttendance = async () => {
    setLoading(true);
    const controller = new AbortController();
    try {
      // Fetch public holidays and Sundays
      const holidays = await fetchPublicHolidays(2025, 'IN');
      const sundays = getSundays(2025);

      // Create default leave markings
      const defaultMarkedDates = {};
      holidays.forEach(holiday => {
        defaultMarkedDates[holiday.date] = {
          marked: true,
          dotColor: '#FF9800',
          type: 'Holiday',
          name: holiday.name,
        };
      });
      sundays.forEach(sunday => {
        if (!defaultMarkedDates[sunday]) {
          defaultMarkedDates[sunday] = {
            marked: true,
            dotColor: '#FF9800',
            type: 'Holiday',
            name: 'Sunday',
          };
        }
      });
      console.log('Default markedDates:', JSON.stringify(defaultMarkedDates, null, 2));

      // Fetch attendance from API
      let apiMarkedDates = {};
      try {
        const payload = { userId };
        const config = {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 10000,
          signal: controller.signal,
        };

        console.log('All-Year Attendance Request Payload:', JSON.stringify(payload, null, 2));
        console.log('All-Year Attendance Request Headers:', JSON.stringify(config.headers, null, 2));

        const response = await axios.post(
          'http://192.168.19.154:5000/api/attendance/getAllYearAttendance',
          payload,
          config
        );

        console.log('All-Year Attendance Response:', JSON.stringify(response.data, null, 2));
        apiMarkedDates = response.data.markedDates || {};
      } catch (apiError) {
        console.error('API fetch error:', apiError);
      }

      // Merge API attendance with default holidays and Sundays
      const mergedMarkedDates = {};
      Object.keys(defaultMarkedDates).forEach(date => {
        if (apiMarkedDates[date] && ['Present', 'Absent', 'Late', 'WFH', 'Leave'].includes(apiMarkedDates[date].type)) {
          mergedMarkedDates[date] = apiMarkedDates[date];
        } else {
          mergedMarkedDates[date] = defaultMarkedDates[date];
        }
      });
      Object.keys(apiMarkedDates).forEach(date => {
        if (!mergedMarkedDates[date]) {
          mergedMarkedDates[date] = apiMarkedDates[date];
        }
      });

      console.log('Merged markedDates:', JSON.stringify(mergedMarkedDates, null, 2));
      setMarkedDates(mergedMarkedDates);
    } catch (err) {
      let errorMessage = 'An error occurred while fetching attendance.';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'No attendance record found for this user.';
        } else if (err.response.status === 400) {
          errorMessage = 'Invalid request: userId is required.';
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

      // Fallback to holidays and Sundays
      const fallbackMarkedDates = {};
      const holidays = await fetchPublicHolidays(2025, 'IN');
      const sundays = getSundays(2025);
      holidays.forEach(holiday => {
        fallbackMarkedDates[holiday.date] = {
          marked: true,
          dotColor: '#FF9800',
          type: 'Holiday',
          name: holiday.name,
        };
      });
      sundays.forEach(sunday => {
        if (!fallbackMarkedDates[sunday]) {
          fallbackMarkedDates[sunday] = {
            marked: true,
            dotColor: '#FF9800',
            type: 'Holiday',
            name: 'Sunday',
          };
        }
      });
      console.log('Fallback markedDates:', JSON.stringify(fallbackMarkedDates, null, 2));
      setMarkedDates(fallbackMarkedDates);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getAllYearAttendance();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    getAllYearAttendance();
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return 'check-circle';
      case 'Absent':
        return 'cancel';
      case 'Late':
        return 'alarm';
      case 'Leave':
        return 'event-busy';
      case 'WFH':
        return 'home';
      case 'Holiday':
        return 'celebration';
      default:
        return 'help-outline';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />
      }
    >
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          current={new Date().toISOString().split('T')[0]}
          onDayPress={handleDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: '#6C63FF',
            },
          }}
          theme={{
            backgroundColor: '#FFFFFF',
            calendarBackground: '#FFFFFF',
            textSectionTitleColor: '#6C63FF',
            selectedDayBackgroundColor: '#6C63FF',
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: '#6C63FF',
            dayTextColor: '#2D3748',
            textDisabledColor: '#A0AEC0',
            dotColor: '#6C63FF',
            selectedDotColor: '#FFFFFF',
            arrowColor: '#6C63FF',
            monthTextColor: '#6C63FF',
            indicatorColor: '#6C63FF',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
          renderHeader={(date) => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{date.toString('MMMM yyyy')}</Text>
            </View>
          )}
          dayComponent={({ date, state }) => {
            const isToday = state === 'today';
            const isSelected = date.dateString === selectedDate;
            const isMarked = markedDates[date.dateString]?.marked;
            const dotColor = markedDates[date.dateString]?.dotColor;

            return (
              <TouchableOpacity
                style={[
                  styles.dayWrapper,
                  isToday && !isSelected && styles.todayWrapper,
                  isSelected && styles.selectedDayWrapper,
                ]}
                onPress={() => handleDayPress({ dateString: date.dateString })}
              >
                <Text
                  style={[
                    styles.dayText,
                    state === 'disabled' && styles.disabledDay,
                    isToday && !isSelected && styles.todayText,
                    isSelected && styles.selectedDayText,
                  ]}
                >
                  {date.day}
                </Text>
                {isMarked && (
                  <View style={[styles.dot, { backgroundColor: dotColor || '#FF9800' }]} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.legendContainer}>
        {Object.entries({
          Present: '#4CAF50',
          Absent: '#F44336',
          Late: '#FFC107',
          Leave: '#2196F3',
          WFH: '#9C27B0',
          Holiday: '#FF9800',
        }).map(([status, color]) => (
          <View key={status} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{status}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={styles.loadingIndicator} />
      ) : (
        selectedDate && (
          <Animated.View
            style={[
              styles.detailCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.detailHeader}>
              <Text style={styles.detailDate}>
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              {markedDates[selectedDate]?.type && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: markedDates[selectedDate]?.dotColor },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {markedDates[selectedDate]?.type}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.detailContent}>
              <View style={styles.detailRow}>
                <Icon
                  name={getStatusIcon(markedDates[selectedDate]?.type)}
                  size={24}
                  color={markedDates[selectedDate]?.dotColor || '#718096'}
                />
                <Text style={styles.detailStatus}>
                  {markedDates[selectedDate]?.type || 'No record'}
                </Text>
              </View>
              {markedDates[selectedDate]?.name && (
                <View style={styles.detailRow}>
                  <Icon name="info" size={24} color="#718096" />
                  <Text style={styles.detailStatus}>
                    {markedDates[selectedDate]?.name}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  contentContainer: {
    padding: 16,
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 16,
    height: 360,
  },
  headerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#EDF2F7',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
  },
  dayWrapper: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    margin: 2,
  },
  todayWrapper: {
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  selectedDayWrapper: {
    backgroundColor: '#6C63FF',
  },
  dayText: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500',
  },
  disabledDay: {
    color: '#CBD5E0',
  },
  todayText: {
    color: '#6C63FF',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 4,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  detailDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  detailContent: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailStatus: {
    fontSize: 16,
    color: '#2D3748',
    marginLeft: 12,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#6C63FF',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default AttendanceCalendar;