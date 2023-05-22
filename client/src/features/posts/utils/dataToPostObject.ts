import { PostInterface } from '../types/Post';
import { dataToUserObject } from '../../users';

interface DataToPostObject extends PostInterface {
  _id: string;
  author: any;
}

const dataToPostObject = (props: DataToPostObject): PostInterface => {
  const {
    _id: id,
    title,
    body,
    author,
    comments,
    likes,
    photo,
    createdAt,
    updatedAt,
  } = props;

  const authorObject = dataToUserObject({ ...author });

  const post: PostInterface = {
    id,
    title,
    body,
    author: authorObject,
    comments,
    likes,
    photo,
    createdAt,
    updatedAt,
  };

  return post;
};

export default dataToPostObject;
