import { useAppSelector } from '../../../hooks';
import { UserInterface } from '../types/user';
import StandardButton from '../../../components/StandardButton';

interface UserOverviewProps
  extends Pick<
    UserInterface,
    'firstName' | 'lastName' | 'friends' | 'id' | 'about' | 'profilePicture'
  > {}

export default function UserOverview(props: UserOverviewProps) {
  const loggedUserId = useAppSelector((state) => state.user.id);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { firstName, lastName, id, about, friends, profilePicture } = props;

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center pb-10 mt-5">
        {/* Prrofile picture */}
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={`${process.env.REACT_APP_SERVER_URL}${profilePicture}`}
          alt={`${firstName} ${lastName}`}
        />
        {/* Name */}
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {firstName} {lastName}
        </h5>
        {/* About user */}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {about}
        </span>
        <div className="flex w-full px-8 mt-4 space-x-3 md:mt-6">
          {/* Remove or add friend button */}
          {friends.includes(loggedUserId!) ? (
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
          <StandardButton
            text="Message"
            whiteMode
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            handleClick={(e: React.MouseEvent<HTMLButtonElement>) => {}}
          />
        </div>
      </div>
    </div>
  );
}