import { UserTypes } from '../../users';

export interface PostInterface {
  id: string;
  title: string;
  body: string;
  author: UserTypes.UserInterface;
  comments: string[];
  likes: string[];
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
}
