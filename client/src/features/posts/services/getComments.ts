import axios from 'axios';

import dataToCommentObject from '../utils/dataToCommentObject';
import { CommentInterface } from '../types/Comment';
import { DbQueries } from '../../../types';
import { getToken } from '../../../utils';

type GetCommentsProps = {
  postId: string;
  sortOrder?: DbQueries.SortOrder;
  limit?: number;
  offset?: number;
};

const getComments = async (
  props: GetCommentsProps,
): Promise<CommentInterface[]> => {
  try {
    const {
      postId,
      sortOrder = DbQueries.SortOrder.DESCENDING,
      limit = 1,
      offset = 0,
    } = props;

    axios.defaults.headers.common.Authorization = getToken();

    const apiUrl = `/api/comments/${postId}?sortOrder=${sortOrder}&limit=${limit}&offset=${offset}`;

    const request = await axios.get(apiUrl);

    const { comments: commentsData } = request.data;

    const commentObjects: CommentInterface[] = commentsData.map(
      (comment: any) => {
        return dataToCommentObject(comment);
      },
    );

    return commentObjects;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

export default getComments;
