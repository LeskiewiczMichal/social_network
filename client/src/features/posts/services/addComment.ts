import axios from 'axios';

import { getToken } from '../../../utils';
import dataToCommentObject from '../utils/dataToCommentObject';

interface AddCommentProps {
  body: string;
  postId: string;
}

const addComment = async (props: AddCommentProps) => {
  try {
    const { body, postId } = props;

    axios.defaults.headers.common.Authorization = getToken();

    const apiUrl = `/api/comments/${postId}`;
    const request = await axios.post(apiUrl, { body });

    const { comment: commentData } = request.data;
    const comment = dataToCommentObject(commentData);

    return comment;
  } catch (err: any) {
    console.error(err);
    return null;
  }
};

export default addComment;
