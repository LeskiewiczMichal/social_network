import axios from 'axios';

import { getToken } from '../../../utils';

type RemoveFriendProps = {
  friendToRemove: string;
};

const removeFriend = async (props: RemoveFriendProps): Promise<void> => {
  try {
    const { friendToRemove } = props;
    axios.defaults.headers.common.Authorization = getToken();
    const apiUrl = `/api/users`;

    await axios.put(
      apiUrl,
      {},
      {
        params: { removeFriend: friendToRemove },
      },
    );
  } catch (err: any) {
    console.error(err);
  }
};

export default removeFriend;
