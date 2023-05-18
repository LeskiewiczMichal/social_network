import { Post as PostType } from '../types/Post';

export default function Post(props: PostType) {
  const { title, body, author, comments, likes, photo, createdAt, updatedAt } =
    props;

  return (
    <div className="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto  max-w-md md:max-w-2xl mb-6 md:mb-12">
      <div className="flex flex-col md:flex-row items-start px-4 py-6">
        <img
          className="w-12 h-12 rounded-full object-cover mr-4 shadow mb-4 md:mb-0"
          src={`${process.env.REACT_APP_SERVER_URL}${author.profilePicture}`}
          alt="avatar"
        />
        <div className="">
          {/* User */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 -mt-1">
              {author.firstName} {author.lastName}{' '}
            </h2>
            <small className="text-sm text-gray-700">22h ago</small>
          </div>

          <h4 className="mt-2 text-bold">{title}</h4>

          {/* Text */}
          <p className="mt-1 mb-5 text-gray-700 text-sm ">{body}</p>

          {/* Photo if available */}
          {photo && (
            <img
              className="h-full mb-5 w-full"
              src={`${process.env.REACT_APP_SERVER_URL}${photo}`}
              alt={`${title} post`}
            />
          )}

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
            {/* Comments */}
            <button
              className="flex text-gray-700 text-lg md:text-base mr-3 justify-center items-center border rounded-xl px-4"
              type="button"
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
              <span>{comments.length}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
