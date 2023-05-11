import axios from 'axios';
import { AppThunk } from '../../../types';
import { setUser } from '../../../store/reducers/userReducer';

type LoginProps = {
  email: string;
  password: string;
};

const login =
  (props: LoginProps): AppThunk =>
  async (dispatch) => {
    try {
      const { email, password } = props;

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/auth/login`,
        {
          email,
          password,
        },
      );

      const { token, user } = response.data;
      localStorage.setItem('social_network_token', `Bearer ${token}`);
      dispatch(setUser(user));
    } catch (err: any) {
      console.error(err);
    }
  };

export default login;
