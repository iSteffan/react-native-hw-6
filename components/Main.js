import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '../router';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { authStateChangeUser } from '../Redux/authOperations';

// export default function Main() {
//   const { stateChange } = useSelector(state => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(authStateChangeUser());
//   }, [stateChange]);

//   const routing = useRoute(stateChange);

//   useEffect(() => {}, []);

//   return <NavigationContainer>{routing}</NavigationContainer>;
// }
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
                // headerStyle: styles.headerBox,
                // headerRightContainerStyle: { paddingRight: 16 },
                // headerLeftContainerStyle: { paddingLeft: 16 },
                // headerTitleStyle: styles.headerTitle,
                // headerTitleAlign: 'center',
                // headerLeft: () => <CustomBackButton onPress={() => navigation.goBack()} />,
                // tabBarVisible: false,
                headerShown: true,
              })}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={({ navigation }) => ({
                title: 'Maпа',
                headerTitleAlign: 'center',
                // headerStyle: styles.headerBox,
                // headerRightContainerStyle: { paddingRight: 16 },
                // headerLeftContainerStyle: { paddingLeft: 16 },
                // headerTitleStyle: styles.headerTitle,
                // headerTitleAlign: 'center',
                // headerLeft: () => <CustomBackButton onPress={() => navigation.goBack()} />,
                // tabBarVisible: false,
                headerShown: true,
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
