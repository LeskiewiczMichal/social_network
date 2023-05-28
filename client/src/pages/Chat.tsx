import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import * as ChatFeatures from '../features/chat';
import { LoadingSpinner } from '../components';
import { UserTypes, getUsers } from '../features/users';

export default function Chat() {
  const { userId } = useParams();
  const [chatUser, setChatUser] = useState<UserTypes.UserInterface | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    // Get user
    const handleGetUser = async () => {
      if (!userId) {
        return;
      }
      const user = await getUsers({ usersList: [userId] });
      setChatUser(user[0]);
      setIsLoading(false);
    };

    // Get all users message send to each other, sorted by date

    handleGetUser();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main
      className={`flex flex-col w-full max-h-screen items-center top-16 absolute z-30 px-4 no-scrollbar py-4
          `}
    >
      <div className="w-full max-w-3xl flex flex-col gap-2">
        {/* Top section */}

        <ChatFeatures.TopInfo chatUser={chatUser!} />
        {/* Chat */}
        <ChatFeatures.MessagesSection chatUser={chatUser!} />
      </div>
    </main>
  );
}
