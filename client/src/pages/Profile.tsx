import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import {
  UserOverview,
  UserDetails,
  AllFriendsDisplay,
  ProfilePageReducer,
  UserTypes,
} from '../features/users';
import getUsers from '../features/users/services/getUsers';
import { useAppSelector, useAppDispatch } from '../hooks';
import { PostsSection } from '../features/posts';

export default function Profile() {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loggedUser = useAppSelector((state) => state.user);
  const displayedUserId = useAppSelector((state) => state.profilePage.id);

  useEffect(() => {
    // When id from params changes, get user to display
    const handleGetProfile = async () => {
      try {
        let user: UserTypes.UserInterface[];
        if (userId) {
          user = await getUsers({
            usersList: [userId],
            friendRequests: 'true',
          });
        } else {
          // Display user profile
          user = await getUsers({
            usersList: [loggedUser.id!],
            friendRequests: 'true',
          });
        }
        if (user) {
          dispatch(
            ProfilePageReducer.setUser({
              ...user[0],
              friendRequests: user[0].friendRequests!,
            }),
          );
        }
      } catch (err: any) {
        console.error(err);
      }
    };

    handleGetProfile();
  }, [userId]);

  return (
    <main className="padding-top-header grid grid-cols-1 md:grid-cols-5 items-center bg-background-white min-h-screen">
      <AllFriendsDisplay />

      <div className="flex flex-col items-center h-full md:col-start-2 md:col-end-5 col-start-1 col-end-2">
        <UserOverview />
        <UserDetails />
        <PostsSection author={displayedUserId} />
      </div>
    </main>
  );
}
