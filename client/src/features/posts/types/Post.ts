import { UserTypes } from '../../../types';

export interface PostInterface {
  id: string;
  title: string;
  body: string;
  author: UserTypes.User;
  comments: string[];
  likes: string[];
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
}