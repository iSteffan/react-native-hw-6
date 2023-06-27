import { useState, useEffect, useContext } from 'react';
import { Text, Image, View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { db } from '../../Firebase/config';
import { useSelector } from 'react-redux';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';

export default function PostsScreen({ route, navigation }) {
  // console.log(route.params);
  const [userPosts, setUserPosts] = useState([]);

  // const [posts, setPosts] = useState([]);
  // const [userPosts, setUserPosts] = useState([]);
  const { name, email, userAvatar, userId } = useSelector(state => state.auth);

  // const getAllPosts = async () => {
  //   await db
  //     .firestore()
  //     .collection('posts')
  //     .onSnapshot(data => setPosts(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))));
  // };

  const getAllPosts = async () => {
    try {
      // setIsLoading(true);
      // setError(false);

      const postsRef = collection(db, 'posts');
      const sortedPostsQuery = query(postsRef, orderBy('timePublished', 'desc'));

      onSnapshot(sortedPostsQuery, snapshot => {
        const sortedPosts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setUserPosts(sortedPosts);
      });
    } catch (error) {
      console.log(error);
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const toggleLike = async (postId, likes, likeStatus) => {
    try {
      const userExist = likes.includes(userId);

      if (userExist) {
        const updatedLikes = likes.filter(user => user !== userId);
        const postRef = doc(db, 'posts', postId);
        await setDoc(postRef, { likes: updatedLikes, likeStatus: false }, { merge: true });
      } else {
        const updatedLikes = [...likes, userId];
        const postRef = doc(db, 'posts', postId);
        await setDoc(postRef, { likes: updatedLikes, likeStatus: true }, { merge: true });
      }
    } catch (error) {
      console.log('error-message', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userWrapper}>
        {/* <Image source={{ uri: userAvatar }} resizeMode="cover" style={styles.image} /> */}
        <Image
          source={{ uri: userAvatar }}
          resizeMode="cover"
          style={{ width: 60, height: 60, borderRadius: 16, marginRight: 8 }}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>
      <FlatList
        data={userPosts}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Image source={{ uri: item.photo }} style={styles.postImg} />
            <Text style={styles.postName}>{item.name}</Text>
            <View style={styles.infoWrap}>
              <Pressable
                style={styles.comments}
                onPress={() => navigation.navigate('Comments', item)}
                // onPress={() => {
                //   navigation.navigate('Коментарі', {
                //     image: item.photo,
                //     postId: item.id,
                //   });
                // }}
              >
                <EvilIcons name="comment" size={24} color="#BDBDBD" />
                <Text style={styles.commentText}>0</Text>
              </Pressable>
              <Pressable
                style={styles.location}
                onPress={() => navigation.navigate('Map', { location: item.location })}

                // onPress={() =>
                //   navigation.navigate('Карта', {
                //     name: item.name,
                //     latitude: item.latitude,
                //     longitude: item.longitude,
                //   })
                // }
              >
                <Ionicons name="ios-location-outline" size={24} color="#BDBDBD" />
                <Text style={styles.locationText}>{item.position}</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,

    backgroundColor: '#fff',
  },
  userWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  userInfo: {
    marginLeft: 8,
  },
  userName: {
    fontFamily: 'Roboto-Bold',
    color: '#212121',
    fontSize: 13,
    lineHeight: 15,
  },
  userEmail: {
    fontFamily: 'Roboto-Regular',
    color: '#212121CC',
    fontSize: 11,
    lineHeight: 13,
  },
  postContainer: {
    marginBottom: 34,
    paddingHorizontal: 4,
  },
  postImg: {
    marginBottom: 8,

    width: '100%',
    height: 240,
    borderRadius: 8,
  },
  postName: {
    marginBottom: 11,

    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#212121',
    lineHeight: 19,
  },
  infoWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comments: { flexDirection: 'row', alignItems: 'center' },
  location: { flexDirection: 'row', alignItems: 'center' },
  commentText: {
    fontFamily: 'Roboto-Medium',
    fontWeight: '400',
    fontSize: 16,
    color: '#BDBDBD',
    lineHeight: 19,
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
