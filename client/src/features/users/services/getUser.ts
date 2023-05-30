import axios from 'axios';

import dataToUserObject from '../utils/dataToUserObject';
import { UserInterface } from '../types/user';
import { getToken } from '../../../utils';

type GetUserProps = {
  userId: string;
};

// eslint-disable-next-line consistent-return
const getUser = async (props: GetUserProps): Promise<UserInterface | null> => {
  try {
    const { userId } = props;

    axios.defaults.headers.common.Authorization = getToken();

    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/users/${userId}`;

    const request = await axios.get(apiUrl);
    const { user: userData } = request.data;

    const userObject: UserInterface = dataToUserObject(userData);

    return userObject;
  } catch (err: any) {
    console.error(err);
    return null;
  }
};

export default getUser;
