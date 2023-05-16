import axios from 'axios';

import { AppThunk, UserTypes } from '../../../types';
import dataToUserObject from '../utils/dataToUserObject';
import { setUser } from '../../../store/reducers/userReducer';

const autoLogin =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const token = localStorage.getItem('social_network_token');
      if (token) {
        axios.defaults.headers.common.Authorization = token;

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/users/auth/token`,
        );
        const { user: userData } = response.data;
        const user: UserTypes.User = dataToUserObject({ ...userData });
        dispatch(setUser(user));
      }
    } catch (err: any) {
      /* empty */
    }
  };

export default autoLogin;
