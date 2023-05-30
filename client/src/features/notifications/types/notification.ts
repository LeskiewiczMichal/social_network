import { UserInterface } from '../../users/types/user';

export enum NotificationType {
  FRIEND_REQUEST = 'friendRequest',
  NEW_FRIEND = 'newFriend',
  POST_LIKED = 'postLiked',
  POST_COMMENTED = 'postCommented',
  COMMENT_LIKED = 'commentLiked',
}

export interface NotificationInterface {
  id: string;
  type: NotificationType;
  sender: UserInterface;
  receiver: string;
  createdAt: Date;
}
