import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import {
  UserOverview,
  UserDetails,
  AllFriendsDisplay,
} from '../features/users';
import getUser from '../features/users/actions/getUser';
import { useAppSelector, useAppDispatch } from '../hooks';
import { PostsSection } from '../features/posts';
import { setUser } from '../features/users/reducers/profilePageReducer';

export default function Profile() {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loggedUser = useAppSelector((state) => state.user);
  const displayedUser = useAppSelector((state) => state.profilePage);

  useEffect(() => {
    // When id from params changes, get user to display
    const handleGetUser = async () => {
      try {
        if (userId) {
          const user = await getUser({ userId });
          if (user) {
            dispatch(setUser(user));
          }
        }
      } catch (err: any) {
        console.error(err);
      }
    };

    handleGetUser();
  }, [userId]);

  return (
    <main className="padding-top-header grid grid-cols-1 md:grid-cols-5 items-center bg-background-white min-h-screen">
      <AllFriendsDisplay />

      <div className="flex flex-col items-center h-full md:col-start-2 md:col-end-5 col-start-1 col-end-2">
        <UserOverview />
        <UserDetails />
        <PostsSection authorId={displayedUser.id} />
      </div>
    </main>
  );
}
