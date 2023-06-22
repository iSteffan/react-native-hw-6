import { Text, Image, View, StyleSheet, Pressable } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/photo-bg.jpg')} style={styles.backgroundImage} />
      <View style={styles.contentWrapper}>
        <View style={styles.avatar}>
          <Image source={require('../../assets/images/user-photo-2.png')} />
          <Pressable style={styles.avatarButton}>
            <AntDesign name="pluscircleo" size={24} color="#E8E8E8" />
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('Login')} style={styles.logOutButton}>
          <Feather name="log-out" size={24} color="#BDBDBD" />
        </Pressable>
        <Text style={styles.userName}>Natali Romanova</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 147,
  },
  backgroundImage: {
    position: 'absolute',

    width: 411,
    zIndex: -1,
  },
  avatar: {
    position: 'absolute',
    left: 147,
    top: -61,
  },
  avatarButton: {
    position: 'absolute',
    right: -12,
    bottom: 10,

    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },

  userName: {
    marginTop: 43,

    fontFamily: 'Roboto-Bold',
    color: '#212121',
    fontSize: 30,
    lineHeight: 35,
    textAlign: 'center',
  },
  contentWrapper: {
    paddingHorizontal: 16,

    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  logOutButton: {
    marginLeft: 'auto',
    marginTop: 22,
  },
});
