import db from '../Firebase/config';
import { authSlice } from './authReducer';

export const authSignUpUser =
  ({ email, password, login }) =>
  async (dispatch, getState) => {
    try {
      await db.auth().createUserWithEmailAndPassword(email, password);
      const user = await db.auth().currentUser;

      await user.updateProfile({
        displayName: login,
      });
      const { displayName, uid } = await db.auth().currentUser;

      const userUpdateProfile = {
        login: displayName,
        userId: uid,
      };

      dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
    } catch (error) {
      console.log('error', error);
    }
  };
export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await db.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log('error', error);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {};
