import { UserInterface } from '../../users/types/user';

export interface CommentInterface {
  id: string;
  body: string;
  author: UserInterface;
  likes: string[];
  post: string;
  createdAt: Date;
  updatedAt: Date;
}
