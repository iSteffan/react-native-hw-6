import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import db from '../../Firebase/config';
import { collection, doc, addDoc, onSnapshot, updateDoc } from 'firebase/firestore';

// function displayDateTime() {
//   const months = [
//     'січня',
//     'лютого',
//     'березня',
//     'квітня',
//     'травня',
//     'червня',
//     'липня',
//     'серпня',
//     'вересня',
//     'жовтня',
//     'листопада',
//     'грудня',
//   ];
//   const now = new Date();
//   const date = now.getDate();
//   const month = months[now.getMonth()];
//   const year = now.getFullYear();
//   const hours = now.getHours().toString().padStart(2, '0');
//   const minutes = now.getMinutes().toString().padStart(2, '0');

//   const dateTimeString = `${date} ${month}, ${year} | ${hours}:${minutes}`;
//   return dateTimeString;
// }

export default function CommentsScreen({ route }) {
  const postImage = route.params.image;
  // const postId = route.params.postId;
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { name, userAvatar, email, userId } = useSelector(state => state.auth);

  // const { login } = useSelector(state => state.auth);
  const { id: postId, photo, userId: postOwnerId } = route.params;

  const createComment = async () => {
    const date = new Date().toLocaleDateString('uk-UA');
    const time = new Date().toLocaleTimeString();

    const postDocRef = await doc(db, 'posts', postId);
    const newComment = {
      timePublished: Date.now().toString(),
      comment,
      name,
      email,
      userAvatar,
      date,
      time,
      owner: userId === postOwnerId ? 'user' : 'follower',
    };

    await addDoc(collection(postDocRef, 'comments'), newComment);
    await updateDoc(postDocRef, {
      comments: [...allComments, newComment],
    });
  };

  const getAllComments = async () => {
    const postDocRef = await doc(db, 'posts', postId);
    onSnapshot(collection(postDocRef, 'comments'), snapshot => {
      const allComments = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const sortedComments = [...allComments].sort((a, b) => {
        const dateA = a.timePublished;
        const dateB = b.timePublished;
        return dateA - dateB;
      });

      return setComments(sortedComments);
    });
  };

  // get all comments
  useEffect(() => {
    getAllComments();
  }, [userId, postId]);

  // useEffect(() => {
  //   getAllComments();
  // }, []);

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsKeyboardVisible(false);
  };

  // send comment
  const handleSendComment = () => {
    // if (!comment.trim()) {
    //   Alert.alert(`Будь ласка, введіть свій коментар 😌`);
    //   return;
    // }
    createComment();
    Keyboard.dismiss();
    // Alert.alert(`Ваш коментар успішно надіслано 😉`);
    setComment('');
  };

  // const createComment = async () => {
  //   const date = displayDateTime();

  //   db.firestore()
  //     .collection('posts')
  //     .doc(postId)
  //     .collection('comments')
  //     .add({ comment, login, date });

  //   keyboardHide();
  //   setComment('');
  // };

  // const getAllComments = async () => {
  //   db.firestore()
  //     .collection('posts')
  //     .doc(postId)
  //     .collection('comments')
  //     .onSnapshot(data => setAllComments(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))));
  // };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.container}>
            {!isKeyboardVisible && <Image source={{ uri: postImage }} style={styles.postImage} />}
            <View>
              <FlatList
                scrollEnabled={true}
                data={allComments}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.commentContainer}>
                    <View style={styles.commentTextContainer}>
                      <Text style={styles.commentText}>{item.comment}</Text>
                      <Text style={styles.date}>{item.date}</Text>
                    </View>
                    <Image
                      source={{ uri: item.userAvatar }}
                      // source={require('../../assets/images/user-photo-3.png')}
                      style={styles.image}
                    />
                  </View>
                )}
              />
            </View>

            <View style={styles.inputWrap}>
              <TextInput
                value={comment}
                onChangeText={value => setComment(value)}
                // onChangeText={setComment}
                placeholder="Коментувати..."
                placeholderTextColor={'#BDBDBD'}
                style={styles.input}
                onFocus={() => {
                  setIsKeyboardVisible(true);
                }}
              />
              <Pressable style={styles.sendIcon} onPress={handleSendComment}>
                <AntDesign name="arrowup" size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 180,
    // height: '100%',
    paddingHorizontal: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  postImage: {
    width: '100%',
    height: 240,
    marginBottom: 32,
    borderRadius: 8,
  },
  inputWrap: { paddingBottom: 16 },
  input: {
    backgroundColor: '#E8E8E8',
    height: 50,
    padding: 16,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#E8E8E8',
    fontFamily: 'Roboto-Regular',
  },
  sendIcon: {
    backgroundColor: '#FF6C00',
    width: 34,
    height: 34,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFFFF',
    position: 'absolute',
    right: 8,
    top: 8,
  },
  commentTextContainer: {
    backgroundColor: '#00000008',
    padding: 16,
    width: 299,
  },
  commentText: {
    fontFamily: 'Roboto-Regular',
    color: '#212121',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  commentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  date: {
    color: '#BDBDBD',
    fontSize: 10,
    lineHeight: 12,
  },
});
