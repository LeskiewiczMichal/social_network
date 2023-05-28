import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

import { ProfilePicture } from '../../../components';
import { PostInterface } from '../types/Post';
import CommentsSection from './CommentsSection';
import likePost from '../services/likePost';
import { useAppSelector } from '../../../hooks';

export default function Post(props: PostInterface) {
  const {
    id: postId,
    title,
    body,
    author,
    comments,
    likes,
    photo,
    createdAt,
  } = props;
  const userId = useAppSelector((state) => state.user.id);
  const [currentLikes, setCurrentLikes] = useState<string[]>(likes);
  const [numberOfComments, setNumberOfComments] = useState<number>(
    comments.length,
  );
  const [isLikeButtonDisabled, setIsLikeButtonDisabled] = useState(false);

  const handleLikePost = async () => {
    try {
      setIsLikeButtonDisabled(true);
      await likePost({ postId, userId: userId! });
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
      setIsLikeButtonDisabled(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto min-h-fit  max-w-md md:max-w-2xl mb-6 md:mb-12">
      <div className="flex flex-col md:flex-row items-start px-4 py-2 md:py-6">
        <ProfilePicture
          size={11}
          userId={author.id}
          userPicture={author.profilePicture}
        />
        <div>
          {/* User */}
          <div className="flex items-center justify-between">
            <Link to={`/profile/${author.id}`}>
              <h2 className="text-lg font-semibold text-gray-900 ">
                {author.firstName} {author.lastName}{' '}
              </h2>
            </Link>
            <small className="text-xs text-gray-700 flex flex-col">
              <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
            </small>
          </div>

          <h4 className="mt-2 text-bold">{title}</h4>

          {/* Text */}
          <p className="mt-1 mb-5 text-gray-700 text-sm">{body}</p>

          {/* Photo if available */}
          {photo && (
            <img
              className="h-full max-h-80 sm:max-h-96 md:max-h-full mb-5 w-full"
              src={`${process.env.REACT_APP_SERVER_URL}${photo}`}
              alt={`${title} post`}
            />
          )}

          <div className="mb-2 flex justify-end items-center border-t border-b py-2">
            {/* Hearts button */}
            <button
              className="flex text-gray-700 text-lg md:text-base mr-3 justify-center items-center border rounded-xl px-4"
              type="button"
              aria-label="give a heart"
              onClick={handleLikePost}
              disabled={isLikeButtonDisabled}
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
            {/* Comments button */}
            <button
              className="flex text-gray-700 text-lg md:text-base mr-3 justify-center items-center border rounded-xl px-4"
              type="button"
              aria-label="show all comments"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 mr-1"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
              <span>{numberOfComments}</span>
            </button>
          </div>
          <CommentsSection
            postId={postId}
            numberOfComments={numberOfComments}
            setNumberOfComments={setNumberOfComments}
          />
        </div>
      </div>
    </div>
  );
}
