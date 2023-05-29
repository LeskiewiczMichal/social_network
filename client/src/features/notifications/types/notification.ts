import { UserInterface } from '../../users/types/user';

export enum NotificationType {
  FRIEND_REQUEST = 'friendRequest',
  NEW_FRIEND = 'newFriend',
  POST_LIKED = 'postLiked',
}

export interface NotificationInterface {
  id: string;
  type: NotificationType;
  sender: UserInterface;
  receiver: string;
  createdAt: Date;
}
