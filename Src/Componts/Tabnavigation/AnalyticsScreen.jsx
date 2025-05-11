import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AnalyticsScreen = () => {
  // State for chart type selection
  const [selectedChart, setSelectedChart] = useState('Bar');

  // Sample data for different analytics metrics
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43], // Example: Sales in units
      },
    ],
  };

  const weeklyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [15, 60, 35, 90], // Example: User activity
      },
    ],
  };

  const pieData = [
    { name: 'Smart Lights', population: 215, color: '#FF6B6B', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Thermostats', population: 180, color: '#4ECDC4', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Sensors', population: 95, color: '#45B7D1', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Others', population: 50, color: '#96CEB4', legendFontColor: '#333', legendFontSize: 14 },
  ];

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`, // #6C63FF theme
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6', // Dot size for LineChart
      strokeWidth: '2',
      stroke: '#6C63FF',
    },
    propsForBars: {
      rx: 5, // Rounded bar edges
      ry: 5,
    },
  };

  // Render the selected chart
  const renderChart = () => {
    const screenWidth = Dimensions.get('window').width - 40;
    switch (selectedChart) {
      case 'Bar':
        return (
          <BarChart
            data={monthlyData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=" units"
            chartConfig={chartConfig}
            style={styles.chart}
          />
        );
      case 'Line':
        return (
          <LineChart
            data={weeklyData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=" users"
            chartConfig={chartConfig}
            bezier // Smooth curve
            style={styles.chart}
          />
        );
      case 'Pie':
        return (
          <PieChart
            data={pieData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute // Show raw values
            style={styles.chart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics Dashboard</Text>

      {/* Chart Type Selector */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Chart Type:</Text>
        <Picker
          selectedValue={selectedChart}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedChart(itemValue)}
        >
          <Picker.Item label="Bar Chart" value="Bar" />
          <Picker.Item label="Line Chart" value="Line" />
          <Picker.Item label="Pie Chart" value="Pie" />
        </Picker>
      </View>

      {/* Monthly Performance Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {selectedChart === 'Bar'
            ? 'Monthly Sales'
            : selectedChart === 'Line'
            ? 'Weekly User Activity'
            : 'Device Usage Distribution'}
        </Text>
        {renderChart()}
      </View>

      {/* Additional Analytics Info */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Quick Stats</Text>
        <View style={styles.statItem}>
          <Ionicons name="trending-up" size={20} color="#6C63FF" />
          <Text style={styles.statText}>Total Sales: 315 units</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="people" size={20} color="#4ECDC4" />
          <Text style={styles.statText}>Active Users: 200</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time" size={20} color="#FF6B6B" />
          <Text style={styles.statText}>Avg. Session: 12 mins</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F8FA',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6C63FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#6C63FF',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 10,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  statText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
});

export default AnalyticsScreen;