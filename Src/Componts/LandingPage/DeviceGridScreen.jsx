import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40) / 2 - 10; // Two cards per row with padding

const DeviceGridScreen = ({navigation}) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { name } = useSelector((state) => state.user);
const userid =  "GA001"; // Replace with dynamic user ID if available
  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
  
    try {
      if (!userid) {
        throw new Error("User ID is missing. Cannot fetch devices.");
      }
  
      const response = await fetch(
        "http://192.168.19.154:5000/api/devices/userbaseddevices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userid }),
        }
      );
  
      if (!response.ok) {
        console.warn(`HTTP Error: ${response.status} - ${response.statusText}`);
        throw new Error("Failed to fetch devices. Server responded with an error.");
      }
  
      const data = await response.json();
  
      // Validate data structure
      if (
        typeof data !== "object" ||
        data === null ||
        !("success" in data) ||
        !("devices" in data)
      ) {
        console.error("Unexpected response format:", data);
        throw new Error("Invalid server response structure.");
      }
  
      if (data.success && Array.isArray(data.devices)) {
        const mappedDevices = data.devices.map((device) => ({
          id: device?._id ?? `unknown-${Math.random()}`, // Fallback if no _id
          name: device?.devicename ?? "Unnamed Device",
          icon: device?.deviceDetails?.icon ?? "bulb-outline",
          address: device?.deviceDetails?.address ?? "Unknown",
          isActive: device?.isActive ?? false,
          nickname: device?.devicenickname ?? "",
          deviceuniqueid: device?.deviceuniqueid ?? "N/A",
          deviceid: device?.deviceid ?? "N/A",
        }));
  
        setDevices(mappedDevices);
      } else {
        throw new Error(data.message || "Device fetch unsuccessful.");
      }
    } catch (err) {
      console.error("Device Fetch Error:", err);
      setError(err.message || "Unknown error occurred while fetching devices.");
    } finally {
      setLoading(false);
    }
  };
  

  // Add this function to send notification
  const sendNotification = async (deviceid, isActive) => {
    try {
      const response = await fetch(
        "http://192.168.19.154:5000/api/devices/update-status", // Match your backend IP
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: userid, // Replace with dynamic user ID if available
            deviceid,
            isActive,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
      console.log("Notification sent for device:", deviceid);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDevices();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const toggleConnection = (id) => {
    setDevices(
      devices.map((device) => {
        if (device.id === id) {
          const newStatus = !device.isActive;
          sendNotification(device.deviceid, newStatus); // Trigger notification here
          return { ...device, isActive: newStatus };
        }
        return device;
      })
    );
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
  onPress={() => navigation.navigate(item.name, {
    deviceid: item.deviceid,
    name: item.name,
    nickname: item.nickname,
    uniqueid: item.deviceuniqueid,
    isActive: item.isActive,
  })}
  style={[
    styles.card,
    {
      borderLeftWidth: 4,
      borderLeftColor: item.isActive ? "#6C63FF" : "#E0E0E0",
    },
  ]}
>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconBackground,
            {
              backgroundColor: item.isActive
                ? "rgba(108, 99, 255, 0.1)"
                : "rgba(224, 224, 224, 0.3)",
            },
          ]}
        >
          <Ionicons
            name={
              item.icon === "bulb" ? "bulb-outline" : item.icon // Map API icon to Ionicons
            }
            size={28}
            color={item.isActive ? "#6C63FF" : "#9E9E9E"}
          />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.deviceName}>{item.name}</Text>
        {item.nickname && (
          <Text style={styles.deviceAddress}>Device: {item.nickname}</Text>
        )}
        <Text style={styles.deviceAddress}>ID: {item.deviceuniqueid}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.connectionButton,
          { backgroundColor: item.isActive ? "#FF6584" : "#4CAF50" },
        ]}
        onPress={() => toggleConnection(item.id)}
      >
        <Ionicons
          name={item.isActive ? "power" : "power-outline"}
          size={16}
          color="#fff"
        />
        <Text style={styles.buttonText}>
          {item.isActive ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>

      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: item.isActive
              ? "rgba(76, 175, 80, 0.1)"
              : "rgba(244, 67, 54, 0.1)",
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            { color: item.isActive ? "#4CAF50" : "#F44336" },
          ]}
        >
          {item.isActive ? "Online" : "Offline"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Smart Devices</Text>
        <Text style={styles.headerSubtitle}>
          {devices.filter((d) => d.isActive).length} devices active
        </Text>
      </View>

      {loading && !refreshing && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && devices.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.noDataText}>No devices found.</Text>
        </View>
      )}

      {!loading && !error && devices.length > 0 && (
        <FlatList
          data={devices}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6C63FF"]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#718096",
  },
  gridContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
    overflow: "hidden",
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginBottom: 16,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 4,
  },
  deviceAddress: {
    fontSize: 12,
    color: "#718096",
  },
  connectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 4,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
  },
  noDataText: {
    fontSize: 16,
    color: "#718096",
  },
});

export default DeviceGridScreen;