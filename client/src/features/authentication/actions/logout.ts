import { AppThunk, UserTypes } from '../../../types';
import { setUser } from '../../../store/reducers/userReducer';

const logout = (): AppThunk => async (dispatch) => {
  try {
    localStorage.removeItem(UserTypes.Token.localStorageName);

    dispatch(
      setUser({
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        friends: null,
        country: null,
        city: null,
        postalCode: null,
        about: null,
        friendRequests: null,
        birthday: null,
        profilePicture: null,
        googleId: null,
      }),
    );
  } catch (err) {
    console.error(err);
  }
};

export default logout;
