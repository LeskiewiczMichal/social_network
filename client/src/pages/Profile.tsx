import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { UserOverview } from '../features/users';
import getUser from '../features/users/actions/getUser';
import { UserInterface } from '../features/users/types/user';
import { useAppSelector } from '../hooks';

export default function Profile() {
  const { userId } = useParams();
  const loggedUser = useAppSelector((state) => state.user);
  const [currentUser, setCurrentUser] = useState<UserInterface>({
    ...(loggedUser as unknown as UserInterface),
  });

  useEffect(() => {
    const handleGetUser = async () => {
      try {
        if (userId) {
          const user = await getUser({ userId });
          if (user) {
            setCurrentUser(user);
          }
        }
      } catch (err: any) {
        console.error(err);
      }
    };

    handleGetUser();
  }, [userId]);

  return (
    <main className="padding-top-header flex flex-col items-center">
      <UserOverview
        firstName={currentUser.firstName}
        lastName={currentUser.lastName}
        id={currentUser.id}
        about={currentUser.about}
        friends={currentUser.friends}
        profilePicture={currentUser.profilePicture}
      />
    </main>
  );
}
