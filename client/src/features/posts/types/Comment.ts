import { UserTypes } from '../../../types';

export interface CommentInterface {
  id: string;
  body: string;
  author: UserTypes.User;
  likes: string[];
  post: string[];
  createdAt: Date;
  updatedAt: Date;
}
