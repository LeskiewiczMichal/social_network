import axios from 'axios';

import { AppThunk } from '../../../types';
import { setLoginError } from '../../../store/reducers/errorReducer';

type RegisterProps = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  birthday: string;
  country: string;
  city: string;
  postalCode: string;
  about: string;
  profilePicture: File | null;
  googleId?: string;
};

const register =
  (props: RegisterProps): AppThunk =>
  async (dispatch) => {
    try {
      const {
        firstName,
        lastName,
        email,
        birthday,
        country,
        city,
        postalCode,
        about,
        profilePicture,
        password,
      } = props;

      const formData = new FormData();

      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('birthday', birthday);
      formData.append('country', country);
      formData.append('city', city);
      formData.append('postalCode', postalCode);
      formData.append('about', about);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      formData.append('password', password);

      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/auth/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    } catch (err: any) {
      dispatch(setLoginError(err.response.data.error));
    }
  };

export default register;
