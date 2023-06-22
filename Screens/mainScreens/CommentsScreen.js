import React, { useState } from 'react';
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

function displayDateTime() {
  const months = [
    'січня',
    'лютого',
    'березня',
    'квітня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня',
  ];
  const now = new Date();
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  const dateTimeString = `${date} ${month}, ${year} | ${hours}:${minutes}`;
  return dateTimeString;
}

export default function CommentsScreen({ route }) {
  const postImage = route.params.image;
  const [comments, setComments] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsKeyboardVisible(false);
  };

  const sendComment = () => {
    keyboardHide();
    setComments([...comments, { comment: inputValue, date: displayDateTime() }]);
    setInputValue('');
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.container}>
            {!isKeyboardVisible && <Image source={{ uri: postImage }} style={styles.postImage} />}
            <View>
              <FlatList
                scrollEnabled={true}
                data={comments}
                keyExtractor={(item, indx) => indx.toString()}
                renderItem={({ item }) => (
                  <View style={styles.commentContainer}>
                    <View style={styles.commentTextContainer}>
                      <Text style={styles.commentText}>{item.comment}</Text>
                      <Text style={styles.date}>{item.date}</Text>
                    </View>
                    <Image
                      source={require('../../assets/images/user-photo-3.png')}
                      style={styles.image}
                    />
                  </View>
                )}
              />
            </View>

            <View style={styles.inputWrap}>
              <TextInput
                value={inputValue}
                onChangeText={value => setInputValue(value)}
                placeholder="Коментувати..."
                placeholderTextColor={'#BDBDBD'}
                style={styles.input}
                onFocus={() => {
                  setIsKeyboardVisible(true);
                }}
              />
              <Pressable style={styles.sendIcon} onPress={sendComment}>
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
