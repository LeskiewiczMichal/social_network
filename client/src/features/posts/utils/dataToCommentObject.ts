import { CommentInterface } from '../types/Comment';
import dataToUserObject from '../../../utils/dataToUserObject';

interface DataToCommentObjectProps extends CommentInterface {
  _id: string;
  author: any;
}

const dataToCommentObject = (
  props: DataToCommentObjectProps,
): CommentInterface => {
  const { _id: id, body, author, likes, createdAt, updatedAt, post } = props;

  const authorObject = dataToUserObject({ ...author });

  const comment: CommentInterface = {
    id,
    body,
    author: authorObject,
    post,
    likes,
    createdAt,
    updatedAt,
  };

  return comment;
};

export default dataToCommentObject;
