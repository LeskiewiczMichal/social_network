import { AppThunk } from '../../../types';
import { TokenEnum } from '../types/token';
import { setUser } from '../reducers/userReducer';

const logout = (): AppThunk => async (dispatch) => {
  try {
    localStorage.removeItem(TokenEnum.localStorageName);

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
      }),
    );
  } catch (err) {
    console.error(err);
  }
};

export default logout;
