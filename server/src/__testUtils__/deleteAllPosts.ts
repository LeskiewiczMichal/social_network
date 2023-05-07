import { Post } from '../models';

const deleteAllPosts = async () => {
  try {
    await Post.deleteMany({});
  } catch (error) {
    console.error(error);
  }
};

export default deleteAllPosts;
