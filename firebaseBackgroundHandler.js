import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background/Closed Notification:", remoteMessage);
  const newNotif = {
    id: remoteMessage.messageId || Date.now().toString(), // Fallback ID
    title: remoteMessage.notification?.title || "No Title",
    message: remoteMessage.notification?.body || "No Message",
    timestamp: new Date().toLocaleString(),
  };

  try {
    if (!newNotif.id) {
      console.log("Invalid notification, skipping:", newNotif);
      return;
    }
    const stored = await AsyncStorage.getItem("notifications");
    const currentNotifications = stored ? JSON.parse(stored) : [];
    const updated = [...currentNotifications, newNotif];
    await AsyncStorage.setItem("notifications", JSON.stringify(updated));
  } catch (error) {
    console.error("Error storing background notification:", error);
  }
});

export default messaging;