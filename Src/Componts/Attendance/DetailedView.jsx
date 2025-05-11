import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, FlatList, StyleSheet, Dimensions, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import debounce from 'lodash.debounce';

const { width } = Dimensions.get('screen');

const DetailedView = ({ showDetailedView, setShowDetailedView, filteredData }) => {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(filteredData);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: showDetailedView ? 0 : width,
        useNativeDriver: true,
        bounciness: showDetailedView ? 8 : 0
      }),
      Animated.timing(opacityAnim, {
        toValue: showDetailedView ? 1 : 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: showDetailedView ? 1 : 0.95,
        useNativeDriver: true
      })
    ]).start();
  }, [showDetailedView]);

  useEffect(() => {
    setFilteredEmployees(filteredData);
  }, [filteredData]);

  const statusColors = {
    'Present': { bg: '#e8f5e9', text: '#2e7d32', border: '#4CAF50', icon: 'check-circle' },
    'Absent': { bg: '#ffebee', text: '#c62828', border: '#F44336', icon: 'cancel' },
    'Leave': { bg: '#fff8e1', text: '#ff8f00', border: '#FFC107', icon: 'beach-access' },
    'Half Day': { bg: '#e3f2fd', text: '#1565c0', border: '#2196F3', icon: 'schedule' },
    'Default': { bg: '#f5f5f5', text: '#424242', border: '#9E9E9E', icon: 'help-outline' }
  };

  const getStatusDetails = (status) => statusColors[status] || statusColors['Default'];

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (!query) {
        setFilteredEmployees(filteredData);
      } else {
        const lowerQuery = query.toLowerCase();
        const filtered = filteredData.filter(employee =>
          employee.name.toLowerCase().includes(lowerQuery) ||
          employee.status.toLowerCase().includes(lowerQuery) ||
          (employee.workLocation && employee.workLocation.toLowerCase().includes(lowerQuery))
        );
        setFilteredEmployees(filtered);
      }
    }, 300),
    [filteredData]
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredEmployees(filteredData);
  };

  const renderEmployee = useCallback(({ item }) => {
    const status = getStatusDetails(item.status);
    return (
      <Animated.View
        style={[
          styles.employeeCard,
          {
            opacity: opacityAnim,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, width],
                  outputRange: [0, -width * 0.3],
                  extrapolate: 'clamp'
                })
              },
              { scale: scaleAnim }
            ],
            backgroundColor: status.bg,
            borderLeftWidth: 5,
            borderLeftColor: status.border
          }
        ]}
      >
        <View style={styles.employeeHeader}>
          <View style={styles.nameContainer}>
            <Icon name="person" size={20} color="#555" style={styles.icon} />
            <Text style={[styles.employeeName, { color: status.text }]}>{item.name}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.border }]}>
            <Icon name={status.icon} size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon name="access-time" size={18} color="#555" style={styles.icon} />
          <Text style={styles.detailText}>Check-In: <Text style={styles.timeText}>{item.checkIn || '--:--'}</Text></Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="exit-to-app" size={18} color="#555" style={styles.icon} />
          <Text style={styles.detailText}>Check-Out: <Text style={styles.timeText}>{item.checkOut || '--:--'}</Text></Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="av-timer" size={18} color="#555" style={styles.icon} />
          <Text style={styles.detailText}>
            Working Hours: <Text style={[styles.timeText, item.isPending && styles.pendingText]}>
              {item.workingHours}{item.isPending ? ' (Pending)' : ''}
            </Text>
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon
            name={
              item.workLocation === 'Work from Home' ? 'home' :
              item.workLocation === 'Office' ? 'business' :
              'location-on'
            }
            size={18}
            color="#555"
            style={styles.icon}
          />
          <Text style={styles.detailText}>Location: <Text style={styles.locationText}>{item.workLocation || 'Not specified'}</Text></Text>
        </View>
      </Animated.View>
    );
  }, [opacityAnim, scaleAnim, slideAnim]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
      <LinearGradient colors={['#4a6fa5', '#3a5a8a']} style={styles.headerGradient}>
        <View style={styles.header}>
          <Text style={styles.title}>Employee Attendance</Text>
          <TouchableOpacity onPress={() => setShowDetailedView(false)} style={styles.closeButton}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icon name="close" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          <Text style={styles.summaryCount}>{filteredEmployees.length}</Text> {filteredEmployees.length === 1 ? 'employee' : 'employees'} found
        </Text>
        <View style={styles.statusLegend}>
          {['Present', 'Absent', 'Leave'].map(status => (
            <View key={status} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: statusColors[status].border }]} />
              <Text style={styles.legendText}>{status}</Text>
            </View>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredEmployees}
        renderItem={renderEmployee}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={60} color="#ddd" />
            <Text style={styles.emptyText}>No matching records found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        }
      />
    </Animated.View>
  );
};


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: width,
    height: '100%',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 100
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  closeButton: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0
  },
  clearButton: {
    padding: 5,
    marginLeft: 5
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    marginBottom: 10
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4a6fa5'
  },
  statusLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5
  },
  legendText: {
    fontSize: 12,
    color: '#666'
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 30
  },
  employeeCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 10
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    flexShrink: 1,
    marginLeft: 5
  },
  statusBadge: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase'
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  icon: {
    marginRight: 10,
    width: 24,
    textAlign: 'center'
  },
  detailText: {
    fontSize: 14,
    color: '#666'
  },
  timeText: {
    fontWeight: '600',
    color: '#333'
  },
  pendingText: {
    color: '#FF9800'
  },
  locationText: {
    fontWeight: '500',
    color: '#4a6fa5'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
    fontWeight: '500',
    textAlign: 'center'
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 5,
    textAlign: 'center'
  }
});

export default DetailedView;