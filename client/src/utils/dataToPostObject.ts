import { PostTypes } from '../features/posts';
import dataToUserObject from './dataToUserObject';

type DataToPostObject = {
  _id: string;
  title: string;
  body: string;
  author: any;
  comments: string[];
  likes: string[];
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const datatoPostObject = (props: DataToPostObject): PostTypes.Post => {
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

  const post: PostTypes.Post = {
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

export default datatoPostObject;
