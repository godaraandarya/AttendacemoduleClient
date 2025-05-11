import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AttendanceChart from './AttendanceChart';
import StatusTabs from './StatusTabs';
import EmployeeList from './EmployeeList';
import DetailedView from './DetailedView';

const AttendanceInsightsPage = ({ route }) => {
  const [selectedTab, setSelectedTab] = useState('Present');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const date = new Date().toISOString().split('T')[0];
  
  const useHardcodedData = false; // Toggle for testing

  // Hardcoded data with working hours and leave scenario
  const hardcodedData = [
    {
      _id: '68130c59ae2c8dd796c8a083',
      user: 'Simran',
      userId: 'GA002',
      attendanceStatus: 'present',
      timestamps: [
        {
          date: '2025-05-01',
          times: ['12:17:24', '17:59:09'],
          leave: { type: null, status: null },
          attendanceStatus: 'present',
          _id: '68130c594b4da7462cde72dd',
        },
      ],
      createdAt: '2025-05-01T05:53:29.213Z',
      updatedAt: '2025-05-01T08:05:31.877Z',
    },
    {
      user: 'Sachin',
      userId: 'GA002',
      attendanceStatus: 'present',
      timestamps: [
        {
          date: '2025-05-01',
          times: ['08:57:44', '17:59:09'],
          leave: { type: null, status: null },
          attendanceStatus: 'present',
        },
      ],
    },
    {
      user: 'Deepak',
      userId: 'GA003',
      attendanceStatus: 'leave',
      timestamps: [
        {
          date: '2025-05-01',
          times: [],
          leave: { type: 'family emergency', status: 'approved' },
          attendanceStatus: 'leave',
        },
      ],
    },
  ];

  // Calculate working hours from checkIn and checkOut
  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 'N/A';
    try {
      const [inHours, inMinutes, inSeconds] = checkIn.split(':').map(Number);
      const [outHours, outMinutes, outSeconds] = checkOut.split(':').map(Number);
      const start = new Date(2025, 4, 1, inHours, inMinutes, inSeconds);
      const end = new Date(2025, 4, 1, outHours, outMinutes, outSeconds);
      const diffMs = end - start;
      if (diffMs < 0) return 'Invalid';
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch (err) {
      console.error('Working Hours Error:', err);
      return 'N/A';
    }
  };

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      setError(null);
      try {
        let responseData;
        if (useHardcodedData) {
          responseData = hardcodedData;
          console.log('Using Hardcoded Data:', JSON.stringify(responseData, null, 2));
        } else {
          const response = await axios.post('http://192.168.19.154:5000/api/attendance/fetch', {
            fromDate: date,
            toDate: date,
            userId: 'GA002',
            role: 'admin',
            id: 'a56f7202-2d81-4dd9-972b-43e968bc962a',
          }, { timeout: 10000 });
          responseData = response.data;
          console.log('Fetch Response:', JSON.stringify(responseData, null, 2));
        }

        const processedData = responseData.map((record) => {
          const timestampsForDate = record.timestamps.filter((ts) => {
            const matches = ts.date === date;
            console.log(`Checking timestamp: ts.date=${ts.date}, date=${date}, matches=${matches}`);
            return matches;
          });

          let status, workLocation, checkIn, checkOut, workingHours;
          if (timestampsForDate.length === 0) {
            const statusRaw = record.attendanceStatus || 'absent';
            status = statusRaw
              .replace(/_/g, ' ')
              .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
            return {
              name: record.user,
              userId: record.userId || 'Unknown',
              status,
              workLocation: 'Office',
              checkIn: null,
              checkOut: null,
              workingHours: 'N/A',
            };
          }

          const latestEntry = timestampsForDate[timestampsForDate.length - 1];
          if (latestEntry.leave && latestEntry.leave.status) {
            const typeFormatted = latestEntry.leave.type
              ? latestEntry.leave.type.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
              : 'Unknown';
            switch (latestEntry.leave.status) {
              case 'pending':
                status = `Leave (Pending) - ${typeFormatted}`;
                break;
              case 'approved':
                status = `Leave (Approved) - ${typeFormatted}`;
                break;
              case 'rejected':
                status = `Leave (Rejected) - ${typeFormatted}`;
                break;
              default:
                status = 'Leave (Unknown)';
            }
            workLocation = latestEntry.leave.status === 'approved' ? 'On Leave' : 'Office';
            checkIn = null;
            checkOut = null;
            workingHours = '0h 0m';
          } else {
            const statusRaw = latestEntry.attendanceStatus || record.attendanceStatus || 'absent';
            status = statusRaw
              .replace(/_/g, ' ')
              .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
            workLocation = 'Office';
            const times = [...new Set(
              timestampsForDate.flatMap((ts) =>
                ts.times.filter((time) => /^\d{2}:\d{2}:\d{2}$/.test(time))
              )
            )].sort();
            checkIn = times[0] || null;
            checkOut = times[times.length - 1] || null;
            workingHours = calculateWorkingHours(checkIn, checkOut);
          }

          return {
            name: record.user,
            userId: record.userId || 'Unknown',
            status,
            workLocation,
            checkIn,
            checkOut,
            workingHours,
          };
        }).filter((item) => item !== null);

        console.log('Processed Data:', JSON.stringify(processedData, null, 2));
        setAttendanceData(processedData);
      } catch (err) {
        let errorMessage = 'An unexpected error occurred.';
      
        if (err.response) {
          // Server responded with a status outside the 2xx range
          const status = err.response.status;
          const message = err.response.data?.message || 'Unknown error';
          errorMessage = `Server error: ${status} - ${message}`;
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = `Network error: No response received from server.`;
        } else {
          // Something happened in setting up the request
          errorMessage = `Error: ${err.message}`;
        }
      
        console.error('Fetch Error:', errorMessage, err);
        setError(errorMessage);
      
        // Slight delay for UI update before showing alert
        setTimeout(() => {
          Alert.alert('Error', errorMessage);
        }, 100);
      } finally {
        setLoading(false);
      }
      
    };

    fetchAttendanceData();
  }, [date]);

  const statusCounts = {
    Present: 0,
    Absent: 0,
    Leave: 0,
    HalfDay: 0,
    WorkFromHome: 0,
  };

  attendanceData.forEach((item) => {
    if (item.status.includes('Present')) statusCounts.Present++;
    else if (item.status.includes('Absent')) statusCounts.Absent++;
    else if (item.status.includes('Leave')) statusCounts.Leave++;
    else if (item.status.includes('Half Day')) statusCounts.HalfDay++;
    else if (item.status.includes('Work from Home')) statusCounts.WorkFromHome++;
  });

  const chartData = [
    { name: 'Present', population: statusCounts.Present, color: '#28a745', legendFontColor: '#2d3436', legendFontSize: 14 },
    { name: 'Absent', population: statusCounts.Absent, color: '#dc3545', legendFontColor: '#2d3436', legendFontSize: 14 },
    { name: 'Leave', population: statusCounts.Leave, color: '#ffc107', legendFontColor: '#2d3436', legendFontSize: 14 },
    { name: 'Half Day', population: statusCounts.HalfDay, color: '#17a2b8', legendFontColor: '#2d3436', legendFontSize: 14 },
    { name: 'Work from Home', population: statusCounts.WorkFromHome, color: '#4a6fa5', legendFontColor: '#2d3436', legendFontSize: 14 },
  ].filter((item) => item.population > 0);

  console.log('Chart Data:', JSON.stringify(chartData, null, 2));

  const filteredData = showDetailedView
    ? attendanceData.filter((item) => item.status.includes('Present'))
    : attendanceData.filter((item) => item.status.includes(selectedTab));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <AttendanceChart
        chartData={chartData}
        showDetailedView={showDetailedView}
        setShowDetailedView={setShowDetailedView}
      />

      <DetailedView
        showDetailedView={showDetailedView}
        setShowDetailedView={setShowDetailedView}
        filteredData={filteredData}
      />

      {!showDetailedView && (
        <StatusTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}

      {!showDetailedView && (
        <EmployeeList
          filteredData={filteredData}
          selectedTab={selectedTab}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fb',
    padding: 2,
   
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#4a6fa5',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AttendanceInsightsPage;