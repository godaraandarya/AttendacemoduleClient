import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EmployeeList = ({ filteredData, selectedTab }) => {
  const renderEmployee = ({ item }) => {
    console.log('Rendering item:', item); // Debug log
    return (
      <View style={styles.listRow}>
        <Text style={styles.employeeName}>{item.name} ({item.userId})</Text>
        <Icon name="check-circle" size={20} color="#28a745" style={styles.checkIcon} />
      </View>
    );
  };

  console.log('EmployeeList filteredData:', JSON.stringify(filteredData, null, 2)); // Debug log

  return (
    <View style={styles.listContainer}>
      <Text style={styles.sectionTitle}>{selectedTab} Employees</Text>
      <FlatList
        data={filteredData}
        renderItem={renderEmployee}
        keyExtractor={(item, index) => `${item.userId}-${index}`}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No employees found for {selectedTab}</Text>
        }
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    paddingHorizontal: 0, // Removed padding for tight left alignment
  },
  flatListContent: {
    paddingBottom: 20,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 8, // Minimal padding for touch area
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },
  checkIcon: {
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'center',
    marginVertical: 12,
  },
});

export default EmployeeList;