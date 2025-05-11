import { firebase } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDYQo3r0PnvrSuhi0xeSwepovXV1Lrnq5I',
  authDomain: 'ga-intelli.firebaseapp.com',  // Auth domain is usually of the form {project-id}.firebaseapp.com
  databaseURL: 'https://ga-intelli-default-rtdb.firebaseio.com/',  // Leave it empty if you're not using Realtime Database
  projectId: 'ga-intelli',
  storageBucket: 'ga-intelli.appspot.com',  // Format for storage bucket: {project-id}.appspot.com
  messagingSenderId: '866694245157',
  appId: '1:866694245157:android:f82661853b89c3b9a688cc',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);  // Initialize Firebase if it's not initialized
} else {
  firebase.app();  // Use the existing app instance if it's already initialized
}

export { firebase };
