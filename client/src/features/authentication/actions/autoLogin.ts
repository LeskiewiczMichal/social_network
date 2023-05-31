import axios from 'axios';

import { TokenEnum } from '../types/token';
import { AppThunk } from '../../../types';
import dataToUserObject from '../../users/utils/dataToUserObject';
import { setUser } from '../reducers/userReducer';

const autoLogin =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    try {
      const token = localStorage.getItem(TokenEnum.localStorageName);
      if (token) {
        axios.defaults.headers.common.Authorization = token;

        const response = await axios.get(`/api/users/auth/token`);
        const { user: userData } = response.data;
        const user = dataToUserObject({ ...userData });
        dispatch(
          setUser({
            ...user,
            friendRequests: userData.friendRequests,
          }),
        );
      }
    } catch (err: any) {
      /* empty */
    }
  };

export default autoLogin;
