import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import db from './Firebase/config';
import { useRoute } from './router';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const AuthStack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  db.auth().onAuthStateChanged(user => setUser(user));
  const routing = useRoute(false);

  const [fontsLoaded] = useFonts({
    'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>{routing}</NavigationContainer>
    </Provider>
  );
}

// import { createStackNavigator } from '@react-navigation/stack';

// import LoginScreen from './Screens/auth/LoginScreen';
// import RegistrationScreen from './Screens/auth/RegistrationScreen';
// import Home from './Screens/mainScreen/Home';
// import CommentsScreen from './Screens/mainScreen/CommentsScreen';
// import MapScreen from './Screens/mainScreen/MapScreen';

// const AuthStack = createStackNavigator();

// export const useRoute = isAuth => {
//   if (!isAuth) {
//     return (
//       <AuthStack.Navigator>
//         <AuthStack.Screen
//           options={{
//             headerShown: false,
//           }}
//           name="Register"
//           component={RegistrationScreen}
//         />
//         <AuthStack.Screen
//           options={{
//             headerShown: false,
//           }}
//           name="Login"
//           component={LoginScreen}
//         />
//       </AuthStack.Navigator>
//     );
//   }
//   return (
//     <AuthStack.Navigator>
//       <AuthStack.Screen
//         options={{
//           headerShown: false,
//         }}
//         name="Home"
//         component={Home}
//       />
//       <AuthStack.Screen
//         name="Комментарии"
//         component={CommentsScreen}
//         options={{ headerShown: true, headerTitleAlign: 'center' }}
//       />
//       <AuthStack.Screen
//         name="Карта"
//         component={MapScreen}
//         options={{ headerShown: true, headerTitleAlign: 'center' }}
//       />
//     </AuthStack.Navigator>
//   );
// };
