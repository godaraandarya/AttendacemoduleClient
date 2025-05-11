import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Shape from 'react-native-svg';

const { width } = Dimensions.get('window');
const centerX = width / 2 - 20;

const AttendanceChart = ({ chartData, showDetailedView, setShowDetailedView }) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(spinAnim, {
        toValue: 1,
        friction: 4,
        tension: 10,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg']
  });

  const chartColors = [
    '#6C63FF', '#4CC9F0', '#F72585', '#7209B7', '#3A0CA3', 
    '#4361EE', '#4895EF', '#4CC9F0', '#F72585', '#B5179E'
  ];

  const enhancedChartData = chartData.map((item, index) => ({
    ...item,
    color: chartColors[index % chartColors.length],
    legendFontColor: '#5E5E5E',
    legendFontSize: 12,
  }));

  const totalEmployees = chartData.reduce((sum, item) => sum + item.population, 0);

  return (
    <>
      {!showDetailedView && chartData.length > 0 && (
        <Animated.View 
          style={[
            styles.chartContainer,
            { 
              
            }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Icon name="bar-chart" size={24} color="#6C63FF" style={styles.titleIcon} />
              <Text style={styles.sectionTitle}>Attendance Analytics</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowDetailedView(true)}
              style={styles.detailsButton}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsButtonText}>Detailed View</Text>
              <Icon name="arrow-forward" size={20} color="#6C63FF" />
            </TouchableOpacity>
          </View>

          <View style={styles.chartWrapper}>
            <PieChart
              data={enhancedChartData}
              width={width - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              hasLegend={false}
              style={styles.chart}
              center={[10, 0]}
              avoidFalseZero
            />
            
            <View style={styles.chartCenter}>
              <Shape.Svg width={80} height={80}>
                <Shape.Circle cx={40} cy={40} r={38} fill="#F8F9FA" />
                <Shape.Circle cx={40} cy={40} r={30} fill="#FFFFFF" />
              </Shape.Svg>
              <View style={styles.centerTextContainer}>
                <Text style={styles.chartCenterValue}>{totalEmployees}</Text>
                <Text style={styles.chartCenterText}>Employees</Text>
              </View>
            </View>
          </View>

          <View style={styles.legendContainer}>
            {enhancedChartData.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.legendItem}
                activeOpacity={0.6}
              >
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendValue}>{item.population}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.updateText}>Updated: {new Date().toLocaleTimeString()}</Text>
          </View>
        </Animated.View>
      )}

      {!showDetailedView && chartData.length === 0 && (
        <Animated.View 
          style={[
            styles.emptyContainer,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.emptyIllustration}>
            <Icon name="insert-chart" size={48} color="#E0E0E0" />
            <Shape.Svg width={120} height={120} style={styles.emptyCircle}>
              <Shape.Circle cx={60} cy={60} r={58} stroke="#E0E0E0" strokeWidth={2} fill="none" />
            </Shape.Svg>
          </View>
          <Text style={styles.emptyText}>No Attendance Data</Text>
          <Text style={styles.emptySubtext}>Check back later for analytics</Text>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    letterSpacing: 0.3,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(108, 99, 255, 0.08)',
  },
  detailsButtonText: {
    color: '#6C63FF',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  chart: {
    borderRadius: 16,
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartCenterValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3436',
    marginTop: 2,
  },
  chartCenterText: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 245, 245, 0.6)',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#5E5E5E',
    fontWeight: '500',
    flex: 1,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D3436',
    marginLeft: 4,
  },
  footer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  updateText: {
    fontSize: 10,
    color: '#BDBDBD',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIllustration: {
    position: 'relative',
    marginBottom: 16,
  },
  emptyCircle: {
    position: 'absolute',
    top: -12,
    left: -12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default AttendanceChart;