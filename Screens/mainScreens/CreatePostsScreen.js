import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { db, storage } from '../../Firebase/config';
import * as MediaLibrary from 'expo-media-library';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

const initialPost = {
  image: null,
  title: '',
  position: '',
  location: {
    latitude: '',
    longitude: '',
  },
};

export default function CreatePostsScreen({ navigation }) {
  // const [location, setLocation] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  const [camera, setCamera] = useState(null);
  // const [photo, setPhoto] = useState(null);

  // const [photoLocation, setPhotoLocation] = useState(null);

  const [post, setPost] = useState(initialPost);
  const { image, title, position } = post;
  const { userId, name } = useSelector(state => state.auth);

  const keyboardHide = () => {
    setIsKeyboardVisible(false);
    Keyboard.dismiss();
  };

  const getLocation = async () => {
    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});
    const region = await Location.reverseGeocodeAsync({ latitude, longitude });

    setPost(prevState => ({
      ...prevState,
      location: { latitude, longitude },
      position: region[0].region || region[0].subregion,
    }));
  };

  const takePhoto = async () => {
    try {
      const photo = await camera.takePictureAsync();
      if (!photo) return false;

      await MediaLibrary.createAssetAsync(photo.uri);

      getLocation();
      setPost(prevState => ({ ...prevState, image: photo.uri }));
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(image);
    const file = await response.blob();
    const uniqueImageId = Date.now().toString();
    const path = `images/${uniqueImageId}.jpeg`;
    const storageRef = ref(storage, path);
    const metadata = {
      contentType: 'image/jpeg',
    };

    await uploadBytes(storageRef, file, metadata);

    const downloadPhoto = await getDownloadURL(storageRef);
    return downloadPhoto;
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    const newPost = {
      photo,
      title,
      position,
      location: post.location,
      comments: [],
      likes: [],
      userId,
      name,
      timePublished: +Date.now(),
    };

    try {
      await addDoc(collection(db, 'posts'), newPost);
    } catch (error) {
      console.error('Error while adding doc: ', error.message);
    }
  };

  const handlePublishedPost = () => {
    uploadPostToServer();
    navigation.navigate('Публікації', { ...post });
    keyboardHide();
    resetFormPost();
  };

  const resetFormPost = () => {
    setPost(initialPost);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {!isKeyboardVisible && (
            <View>
              <Camera style={styles.camera} ref={setCamera}>
                <Pressable
                  onPress={takePhoto}
                  accessibilityLabel={'Add picture'}
                  style={styles.snapContainer}
                >
                  <MaterialIcons name="photo-camera" size={24} color="#BDBDBD" />
                </Pressable>
              </Camera>
              <Text style={styles.text}>Редагувати фото</Text>
            </View>
          )}

          <TextInput
            id="title"
            value={title}
            // onChangeText={value => setName(value)}
            onChangeText={value => setPost(prevState => ({ ...prevState, title: value }))}
            placeholder="Назва..."
            placeholderTextColor={'#BDBDBD'}
            onFocus={() => {
              setIsKeyboardVisible(true);
              setIsNameFocused(true);
            }}
            onBlur={() => setIsNameFocused(false)}
            style={{
              ...styles.input,
              borderBottomColor: isNameFocused ? '#ff6c00' : '#e8e8e8',
              marginTop: 30,
            }}
          />
          <View>
            <Ionicons
              name="ios-location-outline"
              size={24}
              color="#BDBDBD"
              style={{
                ...styles.locationIcon,
                color: isLocationFocused ? '#ff6c00' : '#BDBDBD',
              }}
            />
            <TextInput
              id="position"
              value={position}
              // value={location}
              // onChangeText={value => setLocation(value)}
              onChangeText={value => setPost(prevState => ({ ...prevState, position: value }))}
              placeholder="Місцевість..."
              placeholderTextColor={'#BDBDBD'}
              onFocus={() => {
                setIsKeyboardVisible(true);
                setIsLocationFocused(true);
              }}
              onBlur={() => setIsLocationFocused(false)}
              style={{
                ...styles.input,
                borderBottomColor: isLocationFocused ? '#ff6c00' : '#e8e8e8',
                marginTop: 30,
                paddingLeft: 25,
              }}
            />
          </View>
          <Pressable onPress={handlePublishedPost} style={styles.sendBtn}>
            <Text style={styles.buttonText}>Опублікувати</Text>
          </Pressable>
          <View style={styles.trashIconWrap}>
            <Pressable style={styles.trashButton} onPress={resetFormPost}>
              <FontAwesome5 name="trash-alt" size={24} color="#DADADA" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  camera: {
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    height: 240,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
  },
  snapContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF4D',
    borderRadius: 50,
  },
  text: {
    marginTop: 8,

    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#BDBDBD',
    lineHeight: 19,
  },
  input: {
    width: '100%',
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  locationIcon: {
    position: 'absolute',
    bottom: 7,
  },
  sendBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,

    width: '100%',
    height: 50,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    color: '#FFFFFF',
    fontSize: 16,
  },
  trashButton: {
    justifyContent: 'center',
    alignItems: 'center',

    width: 70,
    height: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    textAlign: 'center',
  },
  trashIconWrap: {
    alignItems: 'center',
    marginTop: 140,
  },
});
