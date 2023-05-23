import axios from 'axios';

import { TokenEnum } from '../types/token';
import { AppThunk } from '../../../types';
import { setUser } from '../reducers/userReducer';
import { setLoginError } from '../../../store/reducers/errorReducer';
import dataToUserObject from '../../users/utils/dataToUserObject';

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
      const user = dataToUserObject({ ...userData });

      localStorage.setItem(TokenEnum.localStorageName, `Bearer ${token}`);
      dispatch(
        setUser({
          ...user,
          friendRequests: userData.friendRequests,
        }),
      );
      dispatch(setLoginError(null));
    } catch (err: any) {
      dispatch(setLoginError(err.response.data.error));
    }
  };

export default login;
