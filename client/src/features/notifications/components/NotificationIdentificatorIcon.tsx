import { NotificationType } from '../types/notification';
import { ReactComponent as FriendIcon } from '../assets/friend.svg';
import { ReactComponent as HeartIcon } from '../assets/heart.svg';
import { ReactComponent as CommentIcon } from '../assets/comment.svg';

interface NotificationIdentificatorIconProps {
  type: NotificationType;
}

export default function NotificationIdentificatorIcon(
  props: NotificationIdentificatorIconProps,
) {
  const { type } = props;

  if (type === NotificationType.FRIEND_REQUEST) {
    return (
      <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-green-200 border border-white rounded-full dark:border-gray-800">
        <FriendIcon className="w-3 h-3 text-primary" />
      </div>
    );
  }
  if (type === NotificationType.NEW_FRIEND) {
    return (
      <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-gray-900 border border-white rounded-full dark:border-gray-800">
        <FriendIcon className="w-3 h-3 text-white" />
      </div>
    );
  }
  if (type === NotificationType.POST_LIKED) {
    return (
      <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-red-200 border border-white rounded-full dark:border-gray-800">
        <HeartIcon className="w-3 h-3 text-black" />
      </div>
    );
  }
  if (type === NotificationType.COMMENT_LIKED) {
    return (
      <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-gray-800 border border-white rounded-full dark:border-gray-800">
        <HeartIcon className="w-3 h-3 text-primary-lighter" />
      </div>
    );
  }
  if (type === NotificationType.POST_COMMENTED) {
    return (
      <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-blue-100 border border-white rounded-full dark:border-gray-800">
        <CommentIcon className="w-3 h-3 text-green-500" />
      </div>
    );
  }
  return (
    <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-gray-900 border border-white rounded-full dark:border-gray-800" />
  );
}
