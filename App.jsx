import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native'; // Added for loader
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your components and Walkthrough
import Home from './Src/Componts/Home';
import Login from './Src/Componts/Login/Login';
import SignUp from './Src/Componts/Signup/SignUp';
import WalkthroughAppConfig from './Src/Componts/WalkthroughScreen';
import DynamicAppStyles from './Src/Componts/DynamicAppStyles';
import WalkthroughScreen from './Src/Componts/WalkthroughScreen/WalkthroughScreen';
import NetworkStatus from './Src/Componts/NetworkStatus/NetworkStatus';
import Landingpage from './Src/Componts/LandingPage/Landingpage';
import { firebaseConfig } from './firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AddDevice from './Src/Componts/LandingPage/AddDevice';
import DeviceGridScreen from './Src/Componts/LandingPage/DeviceGridScreen';
import Tabnavigator from './Src/Componts/Tabnavigation/Tabnavigator';
import HelpCenterScreen from './Src/Componts/Accounts/HelpCenterScreen';
import messaging from "./firebaseBackgroundHandler"; // Import to register handler
import NotificationManagerScreen from './Src/Componts/NotificationManagerScreen';
import { Provider } from 'react-redux';
import { store } from './Src/redux/store';
import NewsPage from './Src/Componts/News/NewsPage';
import NewsDetail from './Src/Componts/News/NewsDetail';
import AttendanceLandingPage from './Src/Componts/Attendance/AttendanceLandingPage';
import AttendanceScreen from './Src/Componts/Attendance/AttendanceScreen';
import AttendanceInsightsPage from './Src/Componts/Attendance/AttendaceInsightsPage';
import LeaveApplication from './Src/Componts/Attendance/LeaveApplication';
import LeaveApprovalPage from './Src/Componts/Attendance/LeaveApprovalPage';
import DetailedView from './Src/Componts/Attendance/DetailedView';
import AddEmployeeScreen from './Src/Componts/AddEmployeeScreen';
import ProfessionalPhotoCapture from './Src/Componts/Attendance/PhotoCaptureS3';
GoogleSignin.configure({
  webClientId: '866694245157-rpl76iutkr7m8e00v5tad6leq2j5ohak.apps.googleusercontent.com',
});

const Stack = createStackNavigator();

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWalkthroughCompleted, setIsWalkthroughCompleted] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('userToken');
      const walkthroughDone = await AsyncStorage.getItem('walkthroughCompleted');
      setIsLoggedIn(!!token); // Set login state
      setIsWalkthroughCompleted(walkthroughDone === 'true'); // Set walkthrough state
      setIsReady(true);
    })();
  }, []);

  const handleWalkthroughComplete = async () => {
    await AsyncStorage.setItem('walkthroughCompleted', 'true');
    setIsWalkthroughCompleted(true);
  };

  // Show loader while checking login and walkthrough status
  if (!isReady) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const initialRoute = isWalkthroughCompleted
    ? isLoggedIn
      ? 'Landingpage' // Logged in, go to main app
      : 'Login'       // Not logged in, go to login
    : 'Walkthrough';  // Walkthrough not done

  return (

    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} >
        <Stack.Screen name="Walkthrough">
          {() => (
            <WalkthroughScreen
              appConfig={WalkthroughAppConfig}
              appStyles={DynamicAppStyles}
              onComplete={handleWalkthroughComplete}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home" }}
          initialParams={{ appStyles: DynamicAppStyles ,headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          
          initialParams={{ appStyles: DynamicAppStyles ,headerShown: true}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: "Sign Up" ,headerShown: true}}
          initialParams={{ appStyles: DynamicAppStyles }}
        />
        <Stack.Screen
          name="NotificationManagerScreen"
          component={NotificationManagerScreen}
          options={{ title: "Notifications" }}
          initialParams={{ appStyles: DynamicAppStyles }}
        />
        <Stack.Screen
          name="Landingpage"
          component={Tabnavigator}
          options={{ title: "Dashboard" ,headerShown: false}}
          initialParams={{ appStyles: DynamicAppStyles }}
        />
        <Stack.Screen
          name="Adddevice"
          component={AddDevice}
          options={{ title: "Add Device", headerShown: true }}
          initialParams={{ appStyles: DynamicAppStyles }}
        />
        <Stack.Screen
          name="PhotoCapture"
          component={ProfessionalPhotoCapture}
          options={{ title: "Add Device", headerShown: true }}
          initialParams={{ appStyles: DynamicAppStyles }}
        />
        <Stack.Screen
          name="DeviceGridScreen"
          component={AddEmployeeScreen}
          options={{ title: "My Devices",headerShown: true }}
          initialParams={{ appStyles: DynamicAppStyles }}
        />
        <Stack.Screen
          name="HelpCenterScreen"
          component={HelpCenterScreen}
          options={{ title: "Help Center" }}
          initialParams={{ appStyles: DynamicAppStyles }}
        />
         <Stack.Screen name="Attendace" component={AttendanceLandingPage} options={{ title: 'Attendace' , headerShown: true }} />
         <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} options={{ title: 'Register Face' , headerShown: true }} />
        
         <Stack.Screen name="AttendanceInsightsPage" component={AttendanceInsightsPage} options={{ title: 'Attendace Insights' , headerShown: true }} />
         
         <Stack.Screen name="LeaveApplication" component={LeaveApplication} options={{ title: 'Leave Application' , headerShown: true }} />
         <Stack.Screen name="ApprovalLeave" component={LeaveApprovalPage} options={{ title: 'Leave Request' , headerShown: true }} />

         <Stack.Screen name="NewsPage" component={NewsPage} options={{ title: 'IoT News' , headerShown: true }} />
         <Stack.Screen name="NewsDetail" component={NewsDetail} options={{ title: 'Article Detail', headerShown: true  }} />
         <Stack.Screen name="Details" component={DetailedView} options={{ title: ' Details', headerShown: true  }} />
         <Stack.Screen name ="employeeSchema" component={AddEmployeeScreen} options={{ title: 'Employee Details', headerShown: true  }} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};

// Styles for the loader
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: set a background color
  },
});

export default App;