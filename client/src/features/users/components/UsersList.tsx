import { useEffect, useState } from 'react';

import getUsers from '../services/getUsers';
import { UserInterface } from '../types/user';
import UserOnList from './UserOnList';
import { LoadingSpinner } from '../../../components';

interface UsersListProps {
  firstName: string | undefined;
  lastName?: string | undefined;
}

export default function UsersList(props: UsersListProps) {
  const { firstName, lastName } = props;
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleGetUsers = async () => {
      setIsLoading(true);
      const queriedUsers = await getUsers({ firstName, lastName });
      setUsers(queriedUsers);
      setIsLoading(false);
    };

    handleGetUsers();
  }, [firstName, lastName]);

  return (
    <section className="flex flex-col items-center px-4">
      {users.map((user: UserInterface) => {
        return (
          <UserOnList
            key={user.id}
            id={user.id}
            firstName={user.firstName}
            lastName={user.lastName}
            friends={user.friends}
            email={user.email}
            city={user.city}
            postalCode={user.postalCode}
            country={user.country}
            birthday={user.birthday}
            profilePicture={user.profilePicture}
            about={user.about}
          />
        );
      })}
      {isLoading && <LoadingSpinner />}
    </section>
  );
}

UsersList.defaultProps = {
  lastName: undefined,
};
