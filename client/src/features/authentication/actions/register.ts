import axios from 'axios';
import { AppThunk } from '../../../types';

type RegisterProps = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  birthday: Date;
  country: string;
  street: string;
  city: string;
  postalCode: string;
  about: string;
  profilePicture: string;
  googleId?: string;
};

const register =
  (props: RegisterProps): AppThunk =>
  async () => {
    try {
      const {
        firstName,
        lastName,
        email,
        birthday,
        country,
        street,
        city,
        postalCode,
        about,
        profilePicture,
        password,
      } = props;

      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/`, {
        email,
        password,
        birthday,
        country,
        street,
        city,
        postalCode,
        about,
        profilePicture,
        firstName,
        lastName,
      });
    } catch (err) {
      console.log(err);
    }
  };

export default register;
