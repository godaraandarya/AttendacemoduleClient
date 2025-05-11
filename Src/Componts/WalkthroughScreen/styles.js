// import { StyleSheet } from 'react-native';

// const dynamicStyles = (appStyles, colorScheme) => {
//   return StyleSheet.create({
//     mainContainer: {
//       flex: 1,
//       backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
//     },
//     container: {
//       flex: 1,
//       overflow: 'hidden',
//     },
//     gradientBackground: {
//       position: 'absolute',
//       width: '200%',
//       height: '200%',
//       top: '-50%',
//       left: '-50%',
//       opacity: 0.8,
//     },
//     contentWrapper: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: 30,
//       backgroundColor: 'rgba(0,0,0,0.3)',
//     },
//     iconContainer: {
//       width: 100,
//       height: 100,
//       borderRadius: 50,
//       backgroundColor: 'rgba(255,255,255,0.2)',
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginBottom: 30,
//     },
//     iconShadow: {
//       textShadowColor: 'rgba(0, 0, 0, 0.3)',
//       textShadowOffset: { width: 0, height: 2 },
//       textShadowRadius: 4,
//     },
//     textContainer: {
//       alignItems: 'center',
//       marginBottom: 40,
//     },
//     title: {
//       fontSize: 28,
//       fontWeight: 'bold',
//       textAlign: 'center',
//       marginBottom: 20,
//       color: 'white',
//       textShadowColor: 'rgba(0, 0, 0, 0.3)',
//       textShadowOffset: { width: 0, height: 1 },
//       textShadowRadius: 2,
//     },
//     text: {
//       fontSize: 18,
//       textAlign: 'center',
//       color: 'rgba(255,255,255,0.9)',
//       lineHeight: 26,
//       paddingHorizontal: 20,
//     },
//     authContainer: {
//       width: '100%',
//       marginTop: 40,
//     },
//     employeeButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: appStyles.colorSet[colorScheme].primary,
//       padding: 18,
//       borderRadius: 10,
//       marginBottom: 15,
//       elevation: 5,
//     },
//     employeeButtonText: {
//       flex: 1,
//       fontSize: 18,
//       fontWeight: '600',
//       marginLeft: 15,
//       color: 'white',
//     },
//     orgButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: 'white',
//       padding: 18,
//       borderRadius: 10,
//       elevation: 5,
//     },
//     orgIconContainer: {
//       width: 30,
//       height: 30,
//       borderRadius: 15,
//       backgroundColor: appStyles.colorSet[colorScheme].highlight,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     orgButtonText: {
//       flex: 1,
//       fontSize: 18,
//       fontWeight: '600',
//       marginLeft: 15,
//       color: appStyles.colorSet[colorScheme].primary,
//     },
//     buttonArrow: {
//       marginLeft: 10,
//     },
//     dividerText: {
//       textAlign: 'center',
//       color: 'white',
//       marginVertical: 15,
//       fontSize: 16,
//       fontWeight: 'bold',
//     },
//     dotStyle: {
//       backgroundColor: 'rgba(255,255,255,0.5)',
//       width: 8,
//       height: 8,
//     },
//     activeDotStyle: {
//       backgroundColor: 'white',
//       width: 20,
//       height: 8,
//     },
//     skipButton: {
//       padding: 10,
//       borderRadius: 20,
//       backgroundColor: 'rgba(255,255,255,0.2)',
//     },
//     skipButtonText: {
//       color: 'white',
//       fontSize: 16,
//       fontWeight: '500',
//     },
//     nextButton: {
//       width: 60,
//       height: 60,
//       borderRadius: 30,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: 'rgba(255,255,255,0.3)',
//     },
//     pagination: {
//       position: 'absolute',
//       bottom: 40,
//       left: 0,
//       right: 0,
//       flexDirection: 'row',
//       justifyContent: 'center',
//     },
//     paginationDot: {
//       width: 8,
//       height: 8,
//       borderRadius: 4,
//       backgroundColor: 'rgba(255,255,255,0.5)',
//       marginHorizontal: 4,
//     },
//     paginationDotActive: {
//       backgroundColor: 'white',
//       width: 20,
//     },
//   });
// };

// export default dynamicStyles;