import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import StandardButton from '../../../components/StandardButton';

export default function UserOverview() {
  const loggedUserId = useAppSelector((state) => state.user.id);
  const displayedProfile = useAppSelector((state) => state.profilePage);

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow shadow-primary dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center pb-10 mt-5">
        {/* Profile picture */}
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={`${process.env.REACT_APP_SERVER_URL}${displayedProfile.profilePicture}`}
          alt={`${displayedProfile.firstName} ${displayedProfile.lastName}`}
        />
        {/* Name */}
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {displayedProfile.firstName} {displayedProfile.lastName}
        </h5>
        {/* About user */}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {displayedProfile.about}
        </span>
        <div className="flex w-full px-8 mt-4 space-x-3 md:mt-6">
          {/* Remove or add friend button */}
          {displayedProfile.friends.includes(loggedUserId!) ? (
            <StandardButton
              text="Remove friend"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              handleClick={(e: React.MouseEvent<HTMLButtonElement>) => {}}
            />
          ) : (
            <StandardButton
              text="Add friend"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              handleClick={(e: React.MouseEvent<HTMLButtonElement>) => {}}
            />
          )}
          {/* Message button */}
          <Link
            to={`/chat/${displayedProfile.id}`}
            className="w-full px-4 py-2 border flex justify-center gap-2 border-slate-300 rounded-lg dark:text-white text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // handleClick={(e: React.MouseEvent<HTMLButtonElement>) => {}}
          >
            Message
          </Link>
        </div>
      </div>
    </div>
  );
}
