import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { LoadingSpinner } from '../components';
import { useAppSelector } from '../hooks';
import { getUsers, UserTypes } from '../features/users';

export default function ChatSelecion() {
  const user = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [friends, setFriends] = useState<UserTypes.UserInterface[]>([]);

  useEffect(() => {
    const handleGetUsers = async () => {
      const fetchedUsers = await getUsers({ usersList: user.friends! });
      setFriends(fetchedUsers);
      setIsLoading(false);
    };

    handleGetUsers();
  }, []);

  return (
    <main className="bg-background-white flex flex-col w-full relative padding-top-header overflow-y-scroll no-scrollbar gap-1 ">
      {/* List of friends */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {friends.map((friend: UserTypes.UserInterface) => {
            return (
              <Link
                to={`/chat/${friend.id}`}
                key={friend.id}
                className="w-full border-y-2 border-primary-lighter p-2 rounded-lg flex items-center gap-2"
              >
                <img
                  className="w-9 h-9 flex items-center rounded-full object-cover shadow mb-2 mt-2 md:mb-0"
                  src={`${process.env.REACT_APP_SERVER_URL}${friend.profilePicture}`}
                  aria-label="friends profile picture"
                  loading="lazy"
                  alt="avatar"
                />
                <span>
                  {friend.firstName} {friend.lastName}
                </span>
              </Link>
            );
          })}
        </>
      )}
    </main>
  );
}
