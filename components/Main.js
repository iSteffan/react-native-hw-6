import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '../router';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { authStateChangeUser } from '../Redux/authOperations';

export default function Main() {
  const { stateChange } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, [stateChange]);

  const routing = useRoute(stateChange);

  useEffect(() => {}, []);

  return <NavigationContainer>{routing}</NavigationContainer>;
}
