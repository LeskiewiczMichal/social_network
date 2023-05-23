import { UserInterface } from '../../users/types/user';

export interface PostInterface {
  id: string;
  title: string;
  body: string;
  author: UserInterface;
  comments: string[];
  likes: string[];
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
}
