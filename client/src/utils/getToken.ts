import { TokenEnum } from '../features/authentication';

const getToken = () => {
  return localStorage.getItem(TokenEnum.localStorageName);
};

export default getToken;
