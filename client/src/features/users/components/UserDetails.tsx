import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import { UserInterface } from '../types/user';
import getUsers from '../actions/getUsers';
import sortFriendsByMutual from '../utils/sortFriendsByMutual';
import SeparatorLine from '../../../components/SeparatorLine';
import countMutualFriends from '../utils/countMutualFriends';
import { setShowFriends } from '../reducers/profilePageReducer';

export default function UserDetails() {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state) => state.user);
  const [mutualFriendsCount, setMutualFriendsCount] = useState<number>(0);
  const [userFriends, setUserFriends] = useState<UserInterface[]>([]);
  const displayedUser = useAppSelector((state) => state.profilePage);

  useEffect(() => {
    dispatch(setShowFriends(false));
    // Get user's friends
    const handleGetFriends = async () => {
      try {
        const queriedFriends = await getUsers({
          usersList: displayedUser.friends,
          limit: 3,
        });
        sortFriendsByMutual({
          friends: queriedFriends,
          myFriends: loggedUser.friends!,
        });
        setUserFriends(queriedFriends);
      } catch (err: any) {
        console.error(err);
      }
    };

    // Count number of mutual friends
    setMutualFriendsCount(
      countMutualFriends({
        myFriends: loggedUser.friends!,
        usersFriends: displayedUser.friends,
      }),
    );

    handleGetFriends();
  }, [displayedUser.id]);

  return (
    <section className="w-full max-w-xl p-4 mt-4 bg-white border flex flex-col  justify-between border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {/* Mutual friends */}
      <div className="w-full text-center p-2">
        <div className="flex justify-between text-gray-700 dark:text-gray-400 px-2">
          <span>{mutualFriendsCount} mutual friends</span>
          <button
            type="button"
            onClick={() => dispatch(setShowFriends(!displayedUser.showFriends))}
            className="text-primary"
          >
            Click here to see all
          </button>
        </div>
        {/* A few friends */}
        <div className="flex gap-2 p-2">
          {userFriends.slice(0, 3).map((user: UserInterface) => {
            return (
              <Link
                to={`/profile/${user.id}`}
                className="flex flex-col rounded-lg items-center border w-1/3"
                key={user.id}
              >
                <img
                  className="w-9 h-9 flex items-center rounded-full object-cover shadow mb-2 mt-2 md:mb-0"
                  src={`${process.env.REACT_APP_SERVER_URL}${user.profilePicture}`}
                  loading="lazy"
                  alt="avatar"
                />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <SeparatorLine text="User info" />
      {/* User info */}
      <div className="flex flex-col items-center rounded-lg w-full">
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700">Email: </span>
          <span>{displayedUser.email}</span>
        </div>
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700">Birthday: </span>
          <span>{displayedUser.birthday}</span>
        </div>
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700">Country: </span>
          <span>{displayedUser.country}</span>
        </div>
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700">City: </span>
          <span>{displayedUser.city}</span>
        </div>
      </div>
    </section>
  );
}
