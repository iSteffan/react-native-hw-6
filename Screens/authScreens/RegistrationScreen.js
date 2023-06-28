import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@expo/vector-icons/Feather';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { authSignUpUser } from '../../Redux/authOperations';
import { uploadPhotoToServer } from '../../helpers/uploadPhoto';

export default function RegistrationScreen({ navigation }) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoginFocused, setIsLoginFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const [formData, setFormData] = useState({ photo: '', name: '', email: '', password: '' });

  const dispatch = useDispatch();

  const keyboardHide = () => {
    setIsKeyboardVisible(false);
    Keyboard.dismiss();
  };

  const { name, email, password, photo } = formData;

  const handleAddAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, photo: result.assets[0].uri }));
    }
  };

  const handleRemoveAvatar = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
  };

  const checkCredentials = () => {
    if (!photo || !name || !email || !password) {
      return Alert.alert('', 'Для успішної реєстрації додайте фото та заповніть всі поля форми');
    }
  };

  const handleSubmit = async () => {
    setIsDownloading(true);
    checkCredentials();
    keyboardHide();

    const imageRef = await uploadPhotoToServer(photo);
    const newUser = {
      userAvatar: imageRef,
      name,
      email,
      password,
    };

    try {
      await dispatch(authSignUpUser(newUser));
      setFormData({ name: '', email: '', password: '', photo: '' });
    } catch (error) {
      console.log(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    // {isDownloading ? (): ()}
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}
      >
        <View style={styles.container}>
          <Image source={require('../../assets/images/photo-bg.jpg')} style={styles.image} />
          <View style={styles.formWrap}>
            <View style={styles.avatar}>
              <Image
                style={styles.avatarPhoto}
                source={photo ? { uri: photo } : require('../../assets/images/user-photo-2.png')}
              />
              <Pressable
                onPress={photo ? handleRemoveAvatar : handleAddAvatar}
                accessibilityLabel={photo ? 'Remove Avatar' : 'Add Avatar'}
                style={{
                  ...styles.avatarButton,
                  borderColor: photo ? '#E8E8E8' : '#FF6C00',
                }}
              >
                {photo ? (
                  <Icon
                    name="plus"
                    size={20}
                    color="#E8E8E8"
                    style={{ transform: [{ rotate: '-45deg' }] }}
                  />
                ) : (
                  <Icon name="plus" size={20} color="#FF6C00" />
                )}
              </Pressable>
            </View>
            <Text style={styles.title}>Реєстрація</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={name}
                onChangeText={value => setFormData(prevState => ({ ...prevState, name: value }))}
                placeholder="Логін"
                autoComplete="username"
                placeholderTextColor={'#BDBDBD'}
                style={{
                  ...styles.input,
                  borderColor: isLoginFocused ? '#ff6c00' : '#e8e8e8',
                  backgroundColor: isLoginFocused ? '#fff' : '#f6f6f6',
                  marginBottom: 16,
                }}
                onFocus={() => {
                  setIsKeyboardVisible(true);
                  setIsLoginFocused(true);
                }}
                onBlur={() => setIsLoginFocused(false)}
              />
              <TextInput
                value={email}
                onChangeText={value => setFormData(prevState => ({ ...prevState, email: value }))}
                placeholder="Адреса електронної пошти"
                autoComplete="email"
                autoCapitalize="none"
                placeholderTextColor={'#BDBDBD'}
                keyboardType="email-address"
                style={{
                  ...styles.input,
                  borderColor: isEmailFocused ? '#ff6c00' : '#e8e8e8',
                  backgroundColor: isEmailFocused ? '#fff' : '#f6f6f6',
                  marginBottom: 16,
                }}
                onFocus={() => {
                  setIsKeyboardVisible(true);
                  setIsEmailFocused(true);
                }}
                onBlur={() => setIsEmailFocused(false)}
              />
              <View style={{ position: 'relative' }}>
                <TextInput
                  value={password}
                  onChangeText={value =>
                    setFormData(prevState => ({ ...prevState, password: value }))
                  }
                  placeholder="Пароль"
                  placeholderTextColor={'#BDBDBD'}
                  secureTextEntry={isPasswordHidden}
                  style={{
                    ...styles.input,
                    borderColor: isPasswordFocused ? '#ff6c00' : '#e8e8e8',
                    backgroundColor: isPasswordFocused ? '#fff' : '#f6f6f6',
                  }}
                  onFocus={() => {
                    setIsKeyboardVisible(true);
                    setIsPasswordFocused(true);
                  }}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <Pressable
                  onPress={() => setIsPasswordHidden(prevState => !prevState)}
                  style={styles.toggleButton}
                >
                  <Text style={styles.toggleText}>{isPasswordHidden ? 'Показати' : 'Сховати'}</Text>
                </Pressable>
              </View>
            </View>

            {!isKeyboardVisible && (
              <View>
                <Pressable onPress={handleSubmit} style={styles.button}>
                  <Text style={styles.buttonText}>Зареєстуватися</Text>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate('Login')}
                  style={{
                    marginBottom: 50,
                  }}
                >
                  <Text style={styles.logInText}>Вже є акаунт? Увійти</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',

    height: '100%',
    width: '100%',
  },
  formWrap: {
    paddingHorizontal: 16,
    paddingTop: 92,

    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  avatar: {
    position: 'absolute',
    top: -50,
    left: 135,

    width: 110,
    height: 110,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  avatarPhoto: {
    borderRadius: 16,
    backgroundColor: '#F6F6F6',

    width: 120,
    height: 120,
  },
  avatarButton: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    right: -22,
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  title: {
    marginBottom: 33,

    fontFamily: 'Roboto-Medium',
    textAlign: 'center',
    color: '#212121',
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 35,
    letterSpacing: 1.6,
  },
  inputWrapper: {
    flexDirection: 'column',
    marginBottom: 43,
  },
  image: {
    position: 'absolute',
    top: 0,

    width: '100%',
  },
  input: {
    padding: 15,

    fontFamily: 'Roboto-Regular',
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,

    height: 51,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16,
  },
  logInText: {
    textAlign: 'center',
    marginBottom: 78,

    fontFamily: 'Roboto-Regular',
    color: '#1B4371',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19,
  },
  toggleButton: {
    position: 'absolute',
    top: 12,
    right: 20,
  },
  toggleText: {
    color: '#1B4371',
    fontFamily: 'Roboto-Regular',
    lineHeight: 19,
  },
});

// const validateEmail = str => {
//   const emailRegex =
//     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return emailRegex.test(str);
// };

// const checkTextInput = () => {
//   const { login, email, password } = state;

//   if (!login.trim()) {
//     Alert.alert('Warning', 'Login is required. Please write your login');
//     return;
//   }
//   if (!email.trim()) {
//     Alert.alert('Warning', 'Email is required. Please write your email');
//     return;
//   }
//   if (!validateEmail(email)) {
//     Alert.alert('Warning', 'Please write valid email');
//     return;
//   }
//   if (!password.trim()) {
//     Alert.alert('Warning', 'Password is required. Please write password');
//     return;
//   }
// };
