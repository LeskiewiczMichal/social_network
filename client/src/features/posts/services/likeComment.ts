import axios from 'axios';

import { getToken } from '../../../utils';

interface LikeCommentProps {
  commentId: string;
  userId: string;
}

const likeComment = async (props: LikeCommentProps): Promise<void> => {
  try {
    const { commentId, userId } = props;

    axios.defaults.headers.common.Authorization = getToken();

    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/comments/${commentId}`;
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

export default likeComment;
