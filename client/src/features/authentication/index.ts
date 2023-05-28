import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import autoLogin from './actions/autoLogin';
import logout from './actions/logout';
import { TokenEnum } from './types/token';
import { setSocket } from './reducers/socketReducer';

const SocketReducer = {
  setSocket,
};

export {
  LoginForm,
  RegistrationForm,
  autoLogin,
  logout,
  TokenEnum,
  SocketReducer,
};
