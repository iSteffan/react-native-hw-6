import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './Screens/authScreens/LoginScreen';
import RegistrationScreen from './Screens/authScreens/RegistrationScreen';
import Home from './Screens/mainScreens/Home';
import CommentsScreen from './Screens/mainScreens/CommentsScreen';
import MapScreen from './Screens/mainScreens/MapScreen';

const AuthStack = createStackNavigator();

export const useRoute = isAuth => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Register"
          component={RegistrationScreen}
        />
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Login"
          component={LoginScreen}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        options={{
          headerShown: false,
        }}
        name="Home"
        component={Home}
      />
      <AuthStack.Screen
        name="Коментарі"
        component={CommentsScreen}
        options={{ headerShown: true, headerTitleAlign: 'center' }}
      />
      <AuthStack.Screen
        name="Карта"
        component={MapScreen}
        options={{ headerShown: true, headerTitleAlign: 'center' }}
      />
    </AuthStack.Navigator>
  );
};
