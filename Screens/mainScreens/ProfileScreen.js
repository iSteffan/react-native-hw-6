import { View, Image, Pressable, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../../Firebase/config';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { Avatar } from '../../components/Avatar';
import { authSignOutUser } from '../../Redux/authOperations';

export default function ProfileScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  const { userId, name } = useSelector(state => state.auth);

  const getUserPosts = async () => {
    try {
      const postRef = query(collection(db, 'posts'), where('userId', '==', `${userId}`));
      onSnapshot(postRef, snapshot => {
        setUserPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    getUserPosts();
    if (route.params?.commentsCount) {
      setCommentsCount(prevCount => ({
        ...prevCount,
        [route.params.postId]: route.params.commentsCount,
      }));
    }
  }, [route.params]);

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/photo-bg.jpg')} style={styles.backgroundImage} />
      <View style={styles.contentWrapper}>
        <Avatar />
        <Pressable onPress={signOut} style={styles.logOutButton}>
          <Feather name="log-out" size={24} color="#BDBDBD" />
        </Pressable>
        <Text style={styles.userName}>{name}</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <Image
                source={{
                  uri: item.photo,
                }}
                style={styles.postImg}
              />

              <Text style={styles.imageTitle}>{item.title}</Text>
              <View style={styles.infoWrap}>
                <View style={{ ...styles.infoWrap, width: 80 }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Comments', item)}
                    style={styles.comments}
                  >
                    <AntDesign
                      name="message1"
                      size={20}
                      color={item.comments?.length > 0 ? '#FF6C00' : '#BDBDBD'}
                    />
                    <Text
                      style={{
                        ...styles.commentText,
                        color: item.comments?.length > 0 ? '#FF6C00' : '#BDBDBD',
                      }}
                    >
                      {item.comments ? item.comments?.length : 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.comments}>
                    <AntDesign
                      name="like2"
                      size={20}
                      color={item.likes?.length > 0 ? '#FF6C00' : '#BDBDBD'}
                    />
                    <Text
                      style={{
                        ...styles.commentText,
                        color: item.likes?.length > 0 ? '#FF6C00' : '#BDBDBD',
                      }}
                    >
                      {item.likes ? item.likes?.length : 0}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Pressable
                  onPress={() => navigation.navigate('Map', { location: item.location })}
                  style={styles.location}
                >
                  <Ionicons name="ios-location-outline" size={24} color="#BDBDBD" />
                  <Text style={styles.locationText}>{item.position}</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
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
  postCard: {
    marginBottom: 32,
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
    marginTop: -32,
    marginBottom: 32,
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
    position: 'absolute',
    top: 22,
    right: 18,
  },
  postContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  postImg: {
    // resizeMode: 'cover',
    marginBottom: 8,

    width: '100%',
    height: 240,
    borderRadius: 8,
  },
  imageTitle: {
    marginBottom: 11,

    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#212121',
    lineHeight: 19,
  },
  infoWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  comments: { flexDirection: 'row', alignItems: 'center' },
  commentText: {
    marginLeft: 5,

    fontFamily: 'Roboto-Medium',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#BDBDBD',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Roboto-Medium',
    fontWeight: '400',
    fontSize: 16,
    color: '#212121',
    lineHeight: 19,
    textDecorationLine: 'underline',
  },
});
