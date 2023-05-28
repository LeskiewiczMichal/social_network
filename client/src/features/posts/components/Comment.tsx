import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

import { ProfilePicture } from '../../../components';
import { CommentInterface } from '../types/Comment';
import likeComment from '../services/likeComment';
import { useAppSelector } from '../../../hooks';

export default function Comment(props: CommentInterface) {
  const { body, author, createdAt, likes, id: commentId } = props;
  const userId = useAppSelector((state) => state.user.id);
  const [currentLikes, setCurrentLikes] = useState<string[]>(likes);

  const handleLikePost = () => {
    likeComment({ commentId, userId: userId! });
    if (currentLikes.includes(userId!)) {
      setCurrentLikes((oldLikes) => {
        const newLikes = oldLikes.filter(
          (id) => id.toString() !== userId!.toString(),
        );
        return newLikes;
      });
    } else {
      setCurrentLikes((oldLikes) => {
        return [...oldLikes, userId!];
      });
    }
  };

  return (
    <div className="flex flex-row w-full items-start px-4 py-1">
      <ProfilePicture
        size={10}
        userId={author.id}
        userPicture={author.profilePicture}
      />
      <div className="w-full">
        {/* User */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            <Link aria-label="author profile" to={`/profile/${author.id}`}>
              {author.firstName} {author.lastName}{' '}
            </Link>
          </h2>
          <small className="text-xs text-gray-700 flex flex-col items-center justify-center">
            <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
          </small>
        </div>

        {/* Text */}
        <p className="mt-1 text-gray-700 text-sm bg-gray-200 p-2 rounded-lg">
          {body}
        </p>

        <div className="flex justify-end items-center ">
          {/* Hearts */}
          <button
            className="flex text-gray-700 text-lg md:text-base justify-center items-center"
            type="button"
            aria-label="like comment"
            onClick={handleLikePost}
          >
            <svg
              fill={currentLikes.includes(userId!) ? '#4f46e5' : '#FFFFFF'}
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
            <span>{currentLikes.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
