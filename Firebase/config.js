import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAzpX4yEbPX7c_rAmMisiBU7N1iIAcRGpI',
  authDomain: 'react-native-hw-d6aa0.firebaseapp.com',
  databaseURL: 'https://react-native-hw-d6aa0-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'react-native-hw-d6aa0',
  storageBucket: 'react-native-hw-d6aa0.appspot.com',
  messagingSenderId: '967673438485',
  appId: '1:967673438485:web:9c7b99687aec1eccf7c91c',
  measurementId: 'G-14Y03EH1Z7',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
