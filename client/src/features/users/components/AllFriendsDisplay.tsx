import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setShowFriends } from '../reducers/profilePageReducer';
import { UserInterface } from '../types/user';
import getUsers from '../actions/getUsers';
import sortFriendsByMutual from '../utils/sortFriendsByMutual';
import { LoadingSpinner } from '../../../components';

export default function AllFriendsDisplay() {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state) => state.user);
  const displayedProfile = useAppSelector((state) => state.profilePage);
  const [userFriends, setUserFriends] = useState<UserInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get all user's friends when displayed user changes
    const handleGetFriends = async () => {
      try {
        setIsLoading(true);
        const queriedFriends = await getUsers({
          usersList: displayedProfile.friends,
        });
        sortFriendsByMutual({
          friends: queriedFriends,
          myFriends: loggedUser.friends!,
        });
        setUserFriends(queriedFriends);
        setIsLoading(false);
      } catch (err: any) {
        console.error(err);
      }
    };

    handleGetFriends();
  }, [displayedProfile.id]);

  return (
    <section
      className={`${
        displayedProfile.showFriends ? 'fixed md:sticky' : 'hidden'
      } border border-gray-200 rounded-lg w-5/6 h-5/6 md:h-full md:max-h-[calc(100vh-4rem)] self-start md:w-full gap-2 flex flex-col shadow-xl bg-white md:bg-white/50 p-2 top-1/2 md:top-16 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 z-30`}
    >
      {/* Text and close button */}
      <div className="flex items-center justify-between border-b">
        <span>{displayedProfile.firstName}&apos;s friends:</span>
        <button
          type="button"
          aria-label="close popup"
          onClick={() =>
            dispatch(setShowFriends(!displayedProfile.showFriends))
          }
          className="bg-white md:bg-white/50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {/* List of friends */}
      <div className="flex flex-col overflow-y-scroll no-scrollbar gap-1">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {userFriends.map((user: UserInterface) => {
              return (
                <Link
                  to={`/profile/${user.id}`}
                  key={user.id}
                  aria-label="friend's profile"
                  className="w-full border-y-2 border-primary-lighter p-2 rounded-lg flex items-center gap-2"
                >
                  <img
                    className="w-9 h-9 flex items-center rounded-full object-cover shadow mb-2 mt-2 md:mb-0"
                    src={`${process.env.REACT_APP_SERVER_URL}${user.profilePicture}`}
                    aria-label="friends profile picture"
                    loading="lazy"
                    alt="avatar"
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </Link>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}
