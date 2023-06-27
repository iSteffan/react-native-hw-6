import { Feather, AntDesign } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PostsScreen from './PostsScreen';
import CreatePostsScreen from './CreatePostsScreen';
import ProfileScreen from './ProfileScreen';
import { authSignOutUser } from '../../Redux/authOperations';
import { useDispatch } from 'react-redux';

const BottomTab = createBottomTabNavigator();

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <BottomTab.Navigator
      initialRouteName="Posts"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: styles.header,
        tabBarShowLabel: false,
        tabBarStyle: {
          // justifyContent: 'center',
          // alignItems: 'center',
          height: 83,
          borderTopWidth: 1,
          borderTopColor: '#BDBDBD',
        },
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <BottomTab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Feather
              name="grid"
              size={24}
              color={focused ? '#FF6C00' : '#212121CC'}
              style={{ marginBottom: 28, marginLeft: 90 }}
            />
          ),
          headerRight: () => (
            <Pressable onPress={signOut} style={{ marginRight: 10, marginTop: 10 }}>
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </Pressable>
          ),
        }}
        name="Posts"
        component={PostsScreen}
      />
      <BottomTab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <View style={styles.plusIcon}>
              <Feather name="plus" size={24} color="#FFFFFF" />
            </View>
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.navigate('Posts')}
              style={{ marginLeft: 16, marginTop: 10 }}
            >
              <AntDesign name="arrowleft" size={24} color="#212121CC" />
            </Pressable>
          ),
          tabBarStyle: { display: 'none' },
        }}
        name="CreatePosts"
        component={CreatePostsScreen}
      />
      <BottomTab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Feather
              name="user"
              size={24}
              color={focused ? '#FF6C00' : '#212121CC'}
              style={{ marginBottom: 28, marginRight: 90 }}
            />
          ),
          headerShown: false,
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
  },
  headerTitle: {
    color: '#212121',
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    marginTop: 10,
  },
  plusIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,

    backgroundColor: '#FF6C00',
    width: 70,
    height: 40,
    borderRadius: 20,
  },
});
