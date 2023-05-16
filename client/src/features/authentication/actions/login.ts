import axios from 'axios';

import { AppThunk, UserTypes } from '../../../types';
import { setUser } from '../../../store/reducers/userReducer';
import { setLoginError } from '../../../store/reducers/errorReducer';
import dataToUserObject from '../utils/dataToUserObject';

type LoginProps = {
  email: string;
  password: string;
};

const login =
  (props: LoginProps): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const { email, password } = props;

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/auth/login`,
        {
          email,
          password,
        },
      );

      // Create user with data from request and get token
      const { token, user: userData } = response.data;
      const user: UserTypes.User = dataToUserObject({ ...userData });

      localStorage.setItem('social_network_token', `Bearer ${token}`);
      dispatch(setUser(user));
      dispatch(setLoginError(null));
    } catch (err: any) {
      dispatch(setLoginError(err.response.data.error));
    }
  };

export default login;
