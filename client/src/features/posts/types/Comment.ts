import { UserTypes } from '../../users';

export interface CommentInterface {
  id: string;
  body: string;
  author: UserTypes.UserInterface;
  likes: string[];
  post: string;
  createdAt: Date;
  updatedAt: Date;
}
