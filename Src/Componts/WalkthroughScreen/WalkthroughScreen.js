import React, { useState } from "react";
import { View, Text, useColorScheme, TouchableOpacity, Dimensions } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const WalkthroughScreen = ({ appStyles }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const styles = createStyles(appStyles, colorScheme);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      key: '1',
      title: "Effortless Attendance",
      text: "Simple one-tap check-in for your workforce",
      icon: 'touch-app'
    },
    {
      key: '2',
      title: "Real-time Dashboard",
      text: "Instant insights into employee presence",
      icon: 'insights'
    },
    {
      key: '3',
      title: "Secure Access",
      text: "Enterprise-grade security for your data",
      icon: 'verified-user'
    }
  ];

  const renderItem = ({ item, index }) => (
    <View style={styles.slide}>
      <View style={styles.iconCircle}>
        <Icon name={item.icon} size={36} color={styles.iconCircle.color} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.text}</Text>

      {index === slides.length - 1 && (
        <View style={styles.authSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.primaryButtonText}>User Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.secondaryButtonText}>Register Your Organization</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppIntroSlider
        data={slides}
        renderItem={renderItem}
        onSlideChange={setCurrentIndex}
        showNextButton={false}
        showDoneButton={false}
        dotStyle={styles.inactiveDot}
        activeDotStyle={styles.activeDot}
      />

      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (appStyles, colorScheme) => {
  const isDark = colorScheme === 'dark';
  const primaryColor = appStyles.colorSet[colorScheme].primary;
  const backgroundColor = appStyles.colorSet[colorScheme].mainThemeBackgroundColor;
  const textColor = appStyles.colorSet[colorScheme].mainThemeForegroundColor;

  return {
    container: {
      flex: 1,
      backgroundColor,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: primaryColor + '20', // 20% opacity
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
      color: primaryColor
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: textColor,
      marginBottom: 16,
      textAlign: 'center'
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#AAAAAA' : '#666666',
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: 20
    },
    authSection: {
      width: '100%',
      marginTop: 50
    },
    primaryButton: {
      backgroundColor: primaryColor,
      padding: 16,
      borderRadius: 8,
      marginBottom: 12
    },
    primaryButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center'
    },
    secondaryButton: {
      backgroundColor: backgroundColor,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: primaryColor
    },
    secondaryButtonText: {
      color: primaryColor,
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center'
    },
    pagination: {
      position: 'absolute',
      bottom: 30,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: isDark ? '#444' : '#DDD',
      marginHorizontal: 4
    },
    activeDot: {
      width: 20,
      backgroundColor: primaryColor
    },
    inactiveDot: {
      backgroundColor: isDark ? '#444' : '#DDD'
    }
  };
};

export default WalkthroughScreen;