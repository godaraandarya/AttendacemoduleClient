import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const StatusTabs = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { name: 'Present', icon: 'check-circle', color: '#4CAF50' },
    { name: 'Absent', icon: 'cancel', color: '#F44336' },
    { name: 'Leave', icon: 'event-busy', color: '#FFC107' },
    { name: 'Half Day', icon: 'schedule', color: '#2196F3' },
    { name: 'WFH', icon: 'home', color: '#9C27B0' },
    { name: 'Late', icon: 'alarm', color: '#FF5722' },
    { name: 'On Duty', icon: 'work', color: '#607D8B' },
  ];

  const animatedValues = tabs.map(() => new Animated.Value(1));

  const handlePressIn = (index) => {
    Animated.spring(animatedValues[index], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(animatedValues[index], {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Attendance Status</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {tabs.map((tab, index) => (
          <Animated.View
            key={tab.name}
            style={[
              styles.tabContainer,
              {
                transform: [{ scale: animatedValues[index] }],
                backgroundColor: selectedTab === tab.name ? tab.color : '#FFFFFF',
                borderColor: tab.color,
              }
            ]}
          >
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setSelectedTab(tab.name)}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
              activeOpacity={0.8}
            >
              <Icon 
                name={tab.icon} 
                size={20} 
                color={selectedTab === tab.name ? '#FFFFFF' : tab.color} 
                style={styles.icon}
              />
              <Text style={[
                styles.tabText,
                { color: selectedTab === tab.name ? '#FFFFFF' : tab.color }
              ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 16,
    marginLeft: 8,
  },
  tabContainer: {
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StatusTabs;