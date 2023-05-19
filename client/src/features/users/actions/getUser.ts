import axios from 'axios';

import dataToUserObject from '../utils/dataToUserObject';
import { UserInterface } from '../types/user';
import { getToken } from '../../../utils';

type GetUserProps = {
  userId: string;
};

const getUser = async (props: GetUserProps): Promise<UserInterface> => {
  const { userId } = props;

  axios.defaults.headers.common.Authorization = getToken();

  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/users/${userId}`;

  const request = await axios.get(apiUrl);
  const { user: userData } = request.data;

  const userObject: UserInterface = dataToUserObject(userData);

  return userObject;
};

export default getUser;
