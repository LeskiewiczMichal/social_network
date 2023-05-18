import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

import { CommentInterface } from '../types/Comment';

export default function Comment(props: CommentInterface) {
  const { body, author, createdAt, likes } = props;

  return (
    <div className="flex flex-col md:flex-row items-start px-4 py-6">
      <Link className="" to={`/profile/${author.id}`}>
        <div className="w-12 h-12 rounded-full object-cover mr-4 shadow mb-4 md:mb-0">
          <img
            className="w-12 h-12 rounded-full object-cover mr-4 shadow mb-4 md:mb-0"
            src={`${process.env.REACT_APP_SERVER_URL}${author.profilePicture}`}
            alt="avatar"
          />
        </div>
      </Link>
      <div>
        {/* User */}
        <div className="flex items-center justify-between">
          <Link to={`/profile/${author.id}`}>
            <h2 className="text-lg font-semibold text-gray-900 -mt-1">
              {author.firstName} {author.lastName}{' '}
            </h2>
          </Link>
          <small className="text-sm text-gray-700 flex flex-col">
            <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
          </small>
        </div>

        {/* Text */}
        <p className="mt-1 mb-5 text-gray-700 text-sm ">{body}</p>

        <div className="mb-2 flex justify-end items-center border-t border-b py-2">
          {/* Hearts */}
          <button
            className="flex text-gray-700 text-lg md:text-base mr-3 justify-center items-center border rounded-xl px-4"
            type="button"
          >
            <svg
              fill="#4f46e5"
              viewBox="0 0 24 24"
              className="w-5 h-5 mr-1"
              stroke="#4f46e5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{likes.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
