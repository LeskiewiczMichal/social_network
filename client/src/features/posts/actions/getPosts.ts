import axios from 'axios';

import dataToPostObject from '../utils/dataToPostObject';
import { PostInterface } from '../types/Post';
import { DbQueries } from '../../../types';
import { getToken } from '../../../utils';

// TODO: Add querying by user friends functionality here

type GetPostsProps = {
  sortOrder?: DbQueries.SortOrder;
  limit?: number;
  offset?: number;
};

const getPosts = async (props: GetPostsProps): Promise<PostInterface[]> => {
  try {
    const {
      offset = 0,
      limit = 10,
      sortOrder = DbQueries.SortOrder.DESCENDING,
    } = props;

    axios.defaults.headers.common.Authorization = getToken();

    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/posts?sortOrder=${sortOrder}&limit=${limit}&offset=${offset}}`;

    const request = await axios.get(apiUrl);
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
