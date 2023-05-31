import axios from 'axios';

import { getToken } from '../../../utils';

type RemoveFriendRequestProps = {
  friendToRemove: string;
};

const removeFriendRequest = async (
  props: RemoveFriendRequestProps,
): Promise<void> => {
  try {
    const { friendToRemove } = props;
    axios.defaults.headers.common.Authorization = getToken();
    const apiUrl = `/api/users`;

    await axios.put(
      apiUrl,
      {},
      {
        params: { removeFriendRequest: friendToRemove },
      },
    );
  } catch (err: any) {
    console.error(err);
  }
};

export default removeFriendRequest;
