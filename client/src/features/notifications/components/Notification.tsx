import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

import { NotificationInterface, NotificationType } from '../types/notification';

export default function Notification(props: NotificationInterface) {
  const { sender, type, createdAt } = props;

  let message: string;
  let icon: JSX.Element;
  if (type === NotificationType.FRIEND_REQUEST) {
    message = 'sent a friend request.';
    icon = (
      // Friend svg
      <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-gray-900 border border-white rounded-full dark:border-gray-800">
        <svg
          className="w-3 h-3 text-white"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
        </svg>
      </div>
    );
  } else if (type === NotificationType.NEW_FRIEND) {
    message = 'is now your friend.';
    icon = (
      // Friend svg
      <svg
        className="w-3 h-3 text-white"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
      </svg>
    );
  } else if (type === NotificationType.POST_LIKED) {
    message = 'liked your post.';
    icon = (
      // Heart svg
      <svg
        className="w-3 h-3 text-white"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    );
  } else {
    message = 'liked your post.';
    icon = (
      // Heart svg
      <svg
        className="w-3 h-3 text-white"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    );
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
          {/* COMMMENT SVG */}
          {/* <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-green-400 border border-white rounded-full dark:border-gray-800"> */}
          {/* <svg */}
          {/* className="w-3 h-3 text-white" */}
          {/* aria-hidden="true" */}
          {/* fill="currentColor" */}
          {/* viewBox="0 0 20 20" */}
          {/* xmlns="http://www.w3.org/2000/svg" */}
          {/* > */}
          {/* <path */}
          {/* fillRule="evenodd" */}
          {/* d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" */}
          {/* clipRule="evenodd" */}
          {/* /> */}
          {/* </svg> */}
          {/* </div> */}
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
