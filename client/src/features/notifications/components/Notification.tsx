import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

import { ReactComponent as FriendIcon } from '../assets/friend.svg';
import { ReactComponent as HeartIcon } from '../assets/heart.svg';
import { ReactComponent as CommentIcon } from '../assets/comment.svg';
import { NotificationInterface, NotificationType } from '../types/notification';

export default function Notification(props: NotificationInterface) {
  const { sender, type, createdAt } = props;

  let message: string;
  let icon: JSX.Element;
  if (type === NotificationType.FRIEND_REQUEST) {
    message = 'sent a friend request.';
    icon = <FriendIcon className="w-3 h-3 text-white" />;
  } else if (type === NotificationType.NEW_FRIEND) {
    message = 'is now your friend.';
    icon = <FriendIcon className="w-3 h-3 text-white" />;
  } else if (type === NotificationType.POST_LIKED) {
    message = 'liked your post.';
    icon = <HeartIcon className="w-3 h-3 text-white" />;
  } else {
    message = 'liked your post.';
    icon = <CommentIcon className="w-3 h-3 text-white" />;
  }

  return (
    <div className="flex w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="">
        <Link to={`/profile/${sender.id}`}>
          <img
            className="rounded-full w-11 h-11 border"
            src={`${process.env.REACT_APP_SERVER_URL}${sender.profilePicture}`}
            alt="Profile"
            loading="lazy"
          />
          <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-gray-900 border border-white rounded-full dark:border-gray-800">
            {icon}
          </div>
        </Link>
      </div>

      <div className="w-full pl-3">
        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
          {/* Person name */}
          <Link to={`/profile/${sender.id}`}>
            <span className="font-semibold text-gray-900 dark:text-white">
              {sender.firstName} {sender.lastName}
            </span>
          </Link>
          {/* rest of message */} {message}
        </div>

        <div className="text-xs text-blue-600 dark:text-blue-500">
          <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
        </div>
      </div>
    </div>
  );
}
