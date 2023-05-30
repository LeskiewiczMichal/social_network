import axios from 'axios';

import { dataToUserObject, getToken } from '../../../utils';
import { AppThunk } from '../../../types';
import { EditUserData } from '../types/editUserDataForm';
import * as ProfilePageReducer from '../reducers/profilePageReducer';
import { UserSlice } from '../../authentication';

const editProfile =
  (props: EditUserData): AppThunk =>
  async (dispatch) => {
    try {
      const { about, birthday, city, country, email } = props;

      axios.defaults.headers.common.Authorization = getToken();
      const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/users`;

      const result = await axios.put(apiUrl, {
        about,
        birthday,
        city,
        country,
        email,
      });

      const { user: userData } = result.data;
      const userObject = dataToUserObject(userData);
      dispatch(
        ProfilePageReducer.setUser({
          ...userObject,
          friendRequests: userData.friendRequests,
        }),
      );
      dispatch(
        UserSlice.setUser({
          ...userObject,
          friendRequests: userData.friendRequests,
        }),
      );
    } catch (err: any) {
      console.error(err);
    }
  };

export default editProfile;
