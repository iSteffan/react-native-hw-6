import React, { useState } from 'react';
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
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const initialState = {
  login: '',
  email: '',
  password: '',
};

export default function RegistrationScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [isLoginFocused, setIsLoginFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const keyboardHide = () => {
    setIsKeyboardVisible(false);
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    const { email, password, login } = state;

    keyboardHide();
    console.log(state);
    setState(initialState);
    checkTextInput();

    if (email !== '' && password !== '' && login !== '' && validateEmail(email)) {
      navigation.navigate('Home');
    }
  };

  const validateEmail = str => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(str);
  };

  const checkTextInput = () => {
    const { login, email, password } = state;

    if (!login.trim()) {
      Alert.alert('Warning', 'Login is required. Please write your login');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Warning', 'Email is required. Please write your email');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Warning', 'Please write valid email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Warning', 'Password is required. Please write password');
      return;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}
      >
        <View style={styles.container}>
          <Image source={require('../../assets/images/photo-bg.jpg')} style={styles.image} />
          <View style={styles.formWrap}>
            <View style={styles.avatar}>
              <Pressable style={styles.avatarButton}>
                <AntDesign name="pluscircleo" size={24} color="#FF6C00" />
              </Pressable>
            </View>
            <Text style={styles.title}>Реєстрація</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                value={state.login}
                onChangeText={value => setState(prevState => ({ ...prevState, login: value }))}
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
                value={state.email}
                onChangeText={value => setState(prevState => ({ ...prevState, email: value }))}
                placeholder="Адреса електронної пошти"
                autoComplete="email"
                placeholderTextColor={'#BDBDBD'}
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
                  value={state.password}
                  onChangeText={value =>
                    setState(prevState => ({
                      ...prevState,
                      password: value,
                    }))
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
    left: 150,

    width: 110,
    height: 110,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  avatarButton: {
    position: 'absolute',
    right: -12,
    bottom: 10,
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
