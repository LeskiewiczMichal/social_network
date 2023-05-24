import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../../../hooks';
import { UserInterface } from '../types/user';
import getUsers from '../actions/getUsers';
import sortFriendsByMutual from '../utils/sortFriendsByMutual';
import SeparatorLine from '../../../components/SeparatorLine';

interface UserDetailsProps
  extends Pick<
    UserInterface,
    'friends' | 'id' | 'email' | 'country' | 'city' | 'birthday' | 'firstName'
  > {}

export default function UserDetails(props: UserDetailsProps) {
  const loggedUser = useAppSelector((state) => state.user);
  const { friends, id, email, country, city, birthday, firstName } = props;
  const [mutualFriendsCount, setMutualFriendsCount] = useState<number>(0);
  const [userFriends, setUserFriends] = useState<UserInterface[]>([]);
  const [friendsPopupActive, setFriendsPopupActive] = useState<boolean>(false);

  useEffect(() => {
    setFriendsPopupActive(false);
    // Get user's friends
    const handleGetFriends = async () => {
      try {
        const queriedFriends = await getUsers({ usersList: friends });
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
    setMutualFriendsCount(0);
    loggedUser.friends?.forEach((friend) => {
      if (friends.includes(friend)) {
        setMutualFriendsCount((oldValue) => oldValue + 1);
      }
    });

    handleGetFriends();
  }, [id]);

  return (
    <section className="w-full max-w-xl p-4 mt-4 bg-white border flex flex-col  justify-between border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {/* Mutual friends */}
      <div className="w-full text-center p-2">
        <div className="flex justify-between text-gray-700 dark:text-gray-400 px-2">
          <span>{mutualFriendsCount} mutual friends</span>
          <button
            type="button"
            onClick={() => setFriendsPopupActive((oldState) => !oldState)}
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
      {/* All friends popup */}
      <section
        className={`${
          friendsPopupActive ? 'fixed' : 'hidden'
        } border-2 w-5/6 h-5/6 lg:h-4/6 lg:w-2/12 gap-2 flex flex-col shadow-xl bg-white p-2 top-1/2 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 z-30 overflow-y-scroll no-scrollbar`}
      >
        <div className="flex items-center justify-between">
          <span>{firstName}&apos;s friends:</span>
          <button
            type="button"
            aria-label="close popup"
            onClick={() => setFriendsPopupActive((oldState) => !oldState)}
            className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
        {userFriends.map((user: UserInterface) => {
          return (
            <div
              key={user.id}
              className="w-full border-y-2 p-2 rounded-lg flex items-center justify-between"
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
              <Link
                to={`/profile/${user.id}`}
                className="bg-primary p-1 hover:bg-primary-lighter font-bold text-white rounded-lg focus:outline-none focus:shadow-outline transition duration-150"
              >
                <span>Profile</span>
              </Link>
            </div>
          );
        })}
      </section>

      <SeparatorLine text="User info" />
      {/* User info */}
      <div className="flex flex-col items-center rounded-lg w-full">
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700">Email: </span>
          <span>{email}</span>
        </div>
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700">Birthday: </span>
          <span>{birthday}</span>
        </div>
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700">Country: </span>
          <span>{country}</span>
        </div>
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700">City: </span>
          <span>{city}</span>
        </div>
      </div>
    </section>
  );
}
