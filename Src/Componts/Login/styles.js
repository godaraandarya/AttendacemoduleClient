import { I18nManager, StyleSheet, Platform } from 'react-native';

const dynamicStyles1 = (appStyles, colorScheme) => {
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
    inputContainer: {
      flexDirection: 'row',
      height: 42,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
      alignItems: 'center',
      borderRadius: 25,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    inputField: {
      flex: 1,
      height: '100%',
      paddingLeft: 10,
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      fontSize: 16,
    },
    iconWrapper: {
      width: 40,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    eyeIconWrapper: {
      width: 40,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginContainer: {
      width: '70%',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 25,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
      alignItems: 'center',
    },
    loginText: {
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor, // Changed from backgroundColor to color
      fontSize: 16,
      fontWeight: 'bold',
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    googleSignUpContainer: {
      width: 50,
      height: 50,
      
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    appleSignUpContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#000000',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    iconStyle: {
      // Removed marginHorizontal as it's handled by containers
    },
    forgotPasswordContainer: {
      width: '80%',
      alignSelf: 'center', // Changed from 'left' to 'center' for consistency
      alignItems: 'flex-end',
      marginTop: 8,
      marginBottom: 20,
    },
    forgotPasswordText: {
      fontSize: 14,
      padding: 4,
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginLeft: 40,
      marginTop: 5,
      marginBottom: 5,
    },
    // Removed unused styles
  });
};

export default dynamicStyles1;