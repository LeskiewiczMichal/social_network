import axios from 'axios';

import dataToUserObject from '../utils/dataToUserObject';
import { UserInterface } from '../types/user';
import { getToken } from '../../../utils';

type GetUsersProps = {
  usersList?: string[];
  limit?: number;
  friendRequests?: string;
  firstName?: string;
  lastName?: string;
};

// eslint-disable-next-line consistent-return
const getUsers = async (props: GetUsersProps): Promise<UserInterface[]> => {
  try {
    const { usersList, limit, friendRequests, firstName, lastName } = props;
    axios.defaults.headers.common.Authorization = getToken();
    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/users`;

    if (usersList && usersList.length === 0) {
      return [];
    }

    const request = await axios.get(apiUrl, {
      params: { usersList, limit, friendRequests, firstName, lastName },
    });
    const { users: usersData } = request.data;
    const usersObjects: UserInterface[] = usersData.map((user: any) => {
      return dataToUserObject(user);
    });

    return usersObjects;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

export default getUsers;
