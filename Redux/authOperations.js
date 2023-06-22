import db from '../Firebase/config';

export const authSignUpUser =
  ({ email, password, login }) =>
  async (dispatch, getState) => {
    try {
      const user = await db.auth().createUserWithEmailAndPassword(email, password);
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
