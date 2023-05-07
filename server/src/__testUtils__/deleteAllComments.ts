import { Comment } from '../models';

const deleteAllComments = async () => {
  try {
    await Comment.deleteMany({});
  } catch (error) {
    console.error(error);
  }
};

export default deleteAllComments;
