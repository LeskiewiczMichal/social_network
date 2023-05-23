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
    'friends' | 'id' | 'email' | 'country' | 'city' | 'birthday'
  > {}

export default function UserDetails(props: UserDetailsProps) {
  const loggedUser = useAppSelector((state) => state.user);
  const { friends, id, email, country, city, birthday } = props;
  const [mutualFriendsCount, setMutualFriendsCount] = useState<number>(0);
  const [userFriends, setUserFriends] = useState<UserInterface[]>([]);

  useEffect(() => {
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
    loggedUser.friends?.forEach((friend) => {
      if (friends.includes(friend)) {
        setMutualFriendsCount((oldValue) => oldValue + 1);
      }
    });

    handleGetFriends();
  }, [id]);

  return (
    <section className="w-full max-w-xl p-4 mt-4 bg-white border flex flex-col md:flex-row justify-between border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {/* Mutual friends */}
      <div className="w-full md:w-1/2 text-center p-2">
        <div className="flex justify-between text-gray-700 dark:text-gray-400 px-2">
          <span>{mutualFriendsCount} mutual friends</span>
          <Link to="/BOILERPLATE">
            <span>Click here to see all</span>
          </Link>
        </div>
        <div className="flex gap-2 p-2">
          {userFriends.map((user: UserInterface) => {
            return (
              <Link
                to={`/profile/${user.id}`}
                className="flex flex-col rounded-lg items-center border w-1/3"
                key={user.id}
              >
                <img
                  className="w-9 h-9 flex items-center rounded-full object-cover shadow mb-2 mt-2 md:mb-0"
                  src={`${process.env.REACT_APP_SERVER_URL}${user.profilePicture}`}
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
      <div className="flex flex-col items-center rounded-lg w-full md:w-1/2">
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
