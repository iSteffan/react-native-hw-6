import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { authStateChangeUser } from '../Redux/authOperations';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/authScreens/LoginScreen';
import RegistrationScreen from '../Screens/authScreens/RegistrationScreen';
import Home from '../Screens/mainScreens/Home';
import CommentsScreen from '../Screens/mainScreens/CommentsScreen';
import MapScreen from '../Screens/mainScreens/MapScreen';

const Stack = createStackNavigator();

export default function Main() {
  const dispatch = useDispatch();
  const { stateChange } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" options={{ headerShown: false }}>
        {!stateChange ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Register"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen
              name="Comments"
              component={CommentsScreen}
              options={({ navigation }) => ({
                title: 'Коментарі',
                headerTitleAlign: 'center',
                headerShown: true,
              })}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={({ navigation }) => ({
                title: 'Maпа',
                headerTitleAlign: 'center',
                headerShown: true,
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
