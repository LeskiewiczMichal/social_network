import { UserTypes } from '../types';

const getToken = () => {
  return localStorage.getItem(UserTypes.Token.localStorageName);
};

export default getToken;
