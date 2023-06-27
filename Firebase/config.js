// initialize the project
import { initializeApp } from 'firebase/app';
// Function for connecting the database to the project
import { getFirestore } from 'firebase/firestore';
// Function for connecting file storage to the project
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
// import { API_KEY } from 'react-native-dotenv';

const firebaseConfig = {
  apiKey: 'AIzaSyAzpX4yEbPX7c_rAmMisiBU7N1iIAcRGpI',
  authDomain: 'react-native-hw-d6aa0.firebaseapp.com',
  // databaseURL: 'https://react-native-hw-d6aa0-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'react-native-hw-d6aa0',
  storageBucket: 'react-native-hw-d6aa0.appspot.com',
  messagingSenderId: '967673438485',
  appId: '1:967673438485:web:9c7b99687aec1eccf7c91c',
  // measurementId: 'G-14Y03EH1Z7',
};

// export default firebase.initializeApp(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
