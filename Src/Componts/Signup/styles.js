import { I18nManager, StyleSheet, Platform } from 'react-native';

const dynamicStyles2 = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 25,
      marginBottom: 20,
      alignSelf: 'stretch',
      textAlign: 'left',
      marginLeft: 30,
    },
    // Login Container Style
    loginContainer: {
      width: '70%', // 70% of the screen width
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 25,
      padding: 15,
      marginTop: 20,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      height: 50, // Set a fixed height for the button
      shadowColor: '#000', // Add shadow for IOS
      shadowOffset: { width: 0, height: 4 }, // Shadow properties for iOS
      shadowOpacity: 0.1, // Shadow transparency
      shadowRadius: 5, // Radius for shadow
      elevation: 5, // Elevation for Android to create a shadow effect
    },
    loginText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    inputContainer: {
      height: 45,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 25,
      paddingLeft: 15,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    forgotPasswordText:{
      textAlign:"center"
    },
    appleText:{
        color:"white"
    },
    iconWrapper: {
      position: 'absolute',
      left: 10,
      zIndex: 1,
    },
    inputField: {
      flex: 1,
      height: 40,
      fontSize: 16,
      paddingLeft: 28, // Make space for the icon
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center', // Aligns items horizontally to the center
      alignItems: 'center', // Aligns items vertically to the center
      marginTop: 20, // Optional: space between the icons and the elements above
    },
    forgotPasswordContainer:{
      marginTop:10
    },
    iconStyle: {
      marginHorizontal: 10, // Optional: gives space between the icons
    },
    marginStyle: {
      marginTop: 10,  // Adjust top margin as needed
      marginBottom: 10, // Adjust bottom margin as needed
      marginHorizontal: 30,  // Adjust left and right margin as needed
      textAlign: 'center',  // Centers the text horizontally if needed
    },
    eyeIconWrapper: {
      position: 'absolute',
      right: 10,
      top: 12,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginLeft: 40,
      marginBottom: 10,
    },
    googleButtonStyle: {
      flexDirection: 'row',
      alignSelf: 'center',
      backgroundColor: '#4285F4',
      marginTop: 15,
      color: '#ffffff',
      padding: 10,
      borderRadius: 25,
      width: '70%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    appleButtonStyle: {
      flexDirection: 'row',
      alignSelf: 'center',
      backgroundColor: '#000000',
      marginTop: 15,
      color: '#ffffff',
      padding: 10,
      borderRadius: 25,
      width: '70%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default dynamicStyles2;
