import axios from 'axios';

import { getToken } from '../../../utils';

interface LikePostProps {
  postId: string;
  userId: string;
}

const likePost = async (props: LikePostProps): Promise<void> => {
  try {
    const { postId, userId } = props;

    axios.defaults.headers.common.Authorization = getToken();

    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/posts/${postId}`;
    await axios.put(
      apiUrl,
      {},
      {
        params: { like: userId },
      },
    );
  } catch (err: any) {
    console.error(err);
    throw Error('Something went wrong');
  }
};

export default likePost;
