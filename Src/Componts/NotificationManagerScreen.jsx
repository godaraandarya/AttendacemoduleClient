import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import messaging from "../../firebaseBackgroundHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";

const NotificationManagerScreen = ({ route, navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem("notifications");
      const parsedNotifications = stored ? JSON.parse(stored) : [];
      setNotifications(parsedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotification = async (newNotif) => {
    try {
      if (!newNotif || !newNotif.id) {
        console.log("Invalid notification, skipping:", newNotif);
        return;
      }
      const stored = await AsyncStorage.getItem("notifications");
      const currentNotifications = stored ? JSON.parse(stored) : [];
      const updated = [...currentNotifications, newNotif];
      await AsyncStorage.setItem("notifications", JSON.stringify(updated));
      setNotifications(updated);
      console.log(`Notification stored for user ${newNotif.data?.userid || "unknown"}:`, newNotif);
    } catch (error) {
      console.error("Error storing notification:", error);
    }
  };

  const sendTokenToBackend = async (token) => {
    try {
      const response = await fetch("http://192.168.19.154:5000/api/users/register-push-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: "GA001", pushToken: token }),
      });
      if (!response.ok) throw new Error("Failed to send token");
      console.log("Token sent to backend:", token);
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  };

  const clearNotification = (id) => {
    setNotifications((prev) => {
      const updated = prev.filter((notif) => notif.id !== id);
      AsyncStorage.setItem("notifications", JSON.stringify(updated)).catch((error) =>
        console.error("Error clearing notification:", error)
      );
      return updated;
    });
  };

  useEffect(() => {
    fetchNotifications();

    let unsubscribeForeground = () => {};
    let unsubscribeTap = () => {};

    const setupNotifications = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await messaging().getToken();
          console.log("Notification token:", token);
          await sendTokenToBackend(token);

          unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
            console.log("Message received in foreground:", remoteMessage);
            const newNotif = {
              id: remoteMessage.messageId || Date.now().toString(),
              title: remoteMessage.notification?.title || "No Title",
              message: remoteMessage.notification?.body || "Default Message",
              timestamp: new Date().toLocaleString(),
              data: remoteMessage.data || {},
            };
            await saveNotification(newNotif);
          });

          messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
              if (remoteMessage) {
                console.log("Notification opened from quit state:", remoteMessage);
                navigation.navigate("DeviceGridScreen", {
                  deviceId: remoteMessage.data?.deviceId,
                });
              }
            });

          unsubscribeTap = messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log("Notification opened from background state:", remoteMessage);
            navigation.navigate("DeviceGridScreen", {
              deviceId: remoteMessage.data?.deviceId,
            });
          });
        } else {
          Alert.alert("Permission Denied", "Enable notifications in settings.");
        }
      } catch (error) {
        console.error("Error setting up notifications:", error);
      }
    };

    setupNotifications();

    return () => {
      unsubscribeForeground();
      unsubscribeTap();
    };
  }, [navigation]);

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTimestamp}>
          {item.timestamp} - User: {item.data?.userid || "Unknown"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => clearNotification(item.id)}
      >
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: "#F8FAFC" }]}>
      {loading ? (
        <Text>Loading notifications...</Text>
      ) : notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications available.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: "#9E9E9E",
    marginTop: 4,
  },
  clearButton: {
    backgroundColor: "#FF6584",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  noNotifications: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
});

export default NotificationManagerScreen;