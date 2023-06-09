import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { LoadingSpinner } from '../../../components';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { UserInterface } from '../types/user';
import getUsers from '../services/getUsers';
import sortFriendsByMutual from '../utils/sortFriendsByMutual';
import SeparatorLine from '../../../components/SeparatorLine';
import countMutualFriends from '../utils/countMutualFriends';
import { setShowFriends } from '../reducers/profilePageReducer';
import { EditUserData } from '../types/editUserDataForm';

interface UserOverviewProps {
  handleChangeUserData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeUserDataForm: EditUserData;
}

export default function UserDetails(props: UserOverviewProps) {
  const { handleChangeUserData, changeUserDataForm } = props;
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state) => state.user);
  const [mutualFriendsCount, setMutualFriendsCount] = useState<number>(0);
  const [userFriends, setUserFriends] = useState<UserInterface[]>([]);
  const displayedProfile = useAppSelector((state) => state.profilePage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dispatch(setShowFriends(false));
    // Get 3 user's friends to display
    const handleGetFriends = async () => {
      try {
        const queriedFriends = await getUsers({
          usersList: displayedProfile.friends,
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
        usersFriends: displayedProfile.friends,
      }),
    );

    handleGetFriends();
    setIsLoading(false);
  }, [displayedProfile.id]);
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="w-full max-w-xl p-4 mt-4 mb-6 md:mb-12 bg-white border flex flex-col  justify-between border-gray-200 rounded-lg shadow dark:bg-background-dark dark:border-gray-700">
      {/* Mutual friends */}
      <div className="w-full text-center p-2">
        <div className="flex justify-between text-gray-700 dark:text-text-gray-dark px-2">
          {loggedUser.id !== displayedProfile.id && (
            <span>{mutualFriendsCount} mutual friends</span>
          )}
          <button
            type="button"
            onClick={() =>
              dispatch(setShowFriends(!displayedProfile.showFriends))
            }
            className="text-primary hover:text-primary-lighter dark:text-primary-lighter dark:hover:text-primary"
          >
            Click here to see all
          </button>
        </div>
        {/* A few friends */}
        <div className="flex gap-2 p-2">
          {userFriends.map((user: UserInterface) => {
            return (
              <Link
                to={`/profile/${user.id}`}
                className="bg-gray-100 hover:bg-gray-200 flex flex-col rounded-lg items-center border w-1/3 dark:text-white-dark dark:bg-gray-700 dark:hover:bg-gray-950"
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
      <div className="flex flex-col items-center rounded-lg w-full ">
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700 dark:text-gray-dark">
            Email:{' '}
          </span>
          {displayedProfile.editUserActive ? (
            <input
              type="text"
              name="email"
              className="border p-1 border-primary rounded-lg"
              value={changeUserDataForm.email}
              onChange={handleChangeUserData}
            />
          ) : (
            <span className="dark:text-white-dark">
              {displayedProfile.email}
            </span>
          )}
        </div>
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700 dark:text-gray-dark">
            Birthday:{' '}
          </span>
          {displayedProfile.editUserActive ? (
            <input
              type="date"
              name="birthday"
              className="border p-1 border-primary rounded-lg dark:text-white-dark"
              value={changeUserDataForm.birthday}
              onChange={handleChangeUserData}
            />
          ) : (
            <span className="dark:text-white-dark">
              {displayedProfile.birthday}
            </span>
          )}
        </div>
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700 dark:text-gray-dark">
            Country:{' '}
          </span>
          {displayedProfile.editUserActive ? (
            <input
              type="text"
              name="country"
              className="border p-1 border-primary rounded-lg"
              value={changeUserDataForm.country}
              onChange={handleChangeUserData}
            />
          ) : (
            <span className="dark:text-white-dark">
              {displayedProfile.country}
            </span>
          )}
        </div>
        <div className="flex w-full justify-between">
          <span className="font-semibold text-gray-700 dark:text-gray-dark">
            City:{' '}
          </span>
          {displayedProfile.editUserActive ? (
            <input
              type="text"
              name="city"
              className="border p-1 border-primary rounded-lg"
              value={changeUserDataForm.city}
              onChange={handleChangeUserData}
            />
          ) : (
            <span className="dark:text-white-dark">
              {displayedProfile.city}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
