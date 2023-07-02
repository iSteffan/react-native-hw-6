import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  View,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/config';
import { collection, doc, addDoc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function CommentsScreen({ route }) {
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { name, userAvatar, email, userId } = useSelector(state => state.auth);

  const { id: postId, photo, userId: postOwnerId } = route.params;

  const createComment = async () => {
    const date = new Date().toLocaleDateString('uk-UA');
    const time = new Date().toLocaleTimeString();

    const postDocRef = await doc(db, 'posts', postId);
    const newComment = {
      name,
      email,
      userAvatar,
      comment,
      timePublished: Date.now().toString(),
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

      return setAllComments(sortedComments);
    });
  };

  useEffect(() => {
    getAllComments();
  }, [userId, postId]);

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsKeyboardVisible(false);
  };

  const handleSendComment = () => {
    createComment();
    Keyboard.dismiss();
    setComment('');
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <View
          style={{
            ...styles.wrapper,
            flexDirection: item?.owner === 'user' ? 'row' : 'row-reverse',
          }}
        >
          <View>
            <Image style={styles.avatar} source={{ uri: item.userAvatar }} />
          </View>

          <View style={styles.commentWrapper}>
            <Text style={styles.userName}>{item.name}</Text>
            <View style={styles.commentsTextWrapper}>
              <Text style={styles.comments}>{item.comment}</Text>
            </View>
            <Text style={styles.commentDate}>
              {item.date} | {item.time}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.postImage}
            source={{
              uri: photo,
            }}
          />
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={allComments}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline={true}
            selectionColor="#FF6C00"
            blurOnSubmit={true}
            placeholderTextColor="#BDBDBD"
            placeholder="Коментувати..."
            value={comment}
            onChangeText={value => setComment(value)}
            onBlur={() => {
              setIsKeyboardVisible(false);
            }}
            onFocus={() => {
              setIsKeyboardVisible(true);
            }}
          />
          <TouchableOpacity style={styles.sendIcon} onPress={handleSendComment}>
            <AntDesign name="arrowup" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,

    backgroundColor: '#FFFFFF',
  },
  imageWrapper: {
    alignItems: 'center',

    height: 240,
    borderRadius: 8,
  },
  postImage: { marginBottom: 32, width: '100%', height: 240, borderRadius: 8 },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    flexGrow: 1,
    gap: 5,
    marginTop: 24,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 50,
  },
  userName: {
    marginBottom: 10,

    fontFamily: 'Roboto-Medium',
    fontSize: 13,
    lineHeight: 18,
    color: '#212121',
  },
  commentsTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  commentWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 16,

    maxWidth: 320,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },

  comments: {
    textAlign: 'left',
    marginBottom: 5,

    fontSize: 13,
    lineHeight: 18,
    color: '#212121',
  },

  commentDate: {
    color: '#BDBDBD',
    fontSize: 10,
    lineHeight: 12,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
    alignSelf: 'flex-end',

    width: '100%',
  },
  input: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 54,

    width: '100%',
    height: 50,
    fontSize: 16,
    lineHeight: 19,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 20,
    color: '#212121',
  },
  sendIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
    justifyContent: 'center',
    alignItems: 'center',

    width: 34,
    height: 34,
    borderRadius: 50,
    color: '#FFFFFF',
    backgroundColor: '#FF6C00',
  },
});
