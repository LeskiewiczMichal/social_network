import axios from 'axios';

import dataToPostObject from '../utils/dataToPostObject';
import { PostInterface } from '../types/Post';
import { DbQueries } from '../../../types';
import { getToken } from '../../../utils';

type GetPostsProps = {
  sortOrder?: DbQueries.SortOrder;
  limit?: number;
  offset?: number;
  authorId?: string | null;
  inUserFriends?: boolean;
};

const getPosts = async (props: GetPostsProps): Promise<PostInterface[]> => {
  try {
    const {
      offset = 0,
      limit = 10,
      sortOrder = DbQueries.SortOrder.DESCENDING,
      authorId = null,
      inUserFriends = false,
    } = props;

    axios.defaults.headers.common.Authorization = getToken();

    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/posts`;
    let inFriends = 'false';
    if (inUserFriends && !authorId) {
      inFriends = 'true';
    }
    const request = await axios.get(apiUrl, {
      params: { offset, authorId, sortOrder, limit, inFriends },
    });
    const { posts: postsData } = request.data;

    const postsDataObjects: PostInterface[] = postsData.map((post: any) => {
      return dataToPostObject(post);
    });

    return postsDataObjects;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

export default getPosts;
