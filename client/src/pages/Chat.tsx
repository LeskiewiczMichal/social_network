import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import { Message } from '../features/chat';
import { LoadingSpinner, ProfilePicture } from '../components';
import { UserTypes, getUsers } from '../features/users';

export default function Chat() {
  const { userId } = useParams();
  const [chatUser, setChatUser] = useState<UserTypes.UserInterface | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const elementRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (element.current) {

    } element.scrollTop != element.scrollHeight;
  }, [isLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main
      className={`flex flex-col w-full max-h-screen top-16 absolute z-30 px-4 no-scrollbar gap-1 transform transition duration-500 py-4
          `}
    >
      {/* Top section */}
      <div className="flex text-center bg-white w-full h-fit p-2 rounded-lg justify-between text-primary items-center border shadow border-b-0">
        <Link
          to="/chat"
          className="bg-primary flex justify-center items-center w-1/6 h-8 rounded-xl ml-4"
        >
          <div className="flex flex-row align-middle">
            <svg
              className="w-5 mr-2"
              fill="#FFFFFF"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Link>
        <Link to={`/profile/${chatUser?.id}`}>
          {chatUser?.firstName} {chatUser?.lastName}
        </Link>
        <div className="mt-1">
          <ProfilePicture
            userId={chatUser!.id}
            userPicture={chatUser!.profilePicture}
            size={10}
          />
        </div>
      </div>
      {/* Chat */}
      <div className="h-[34rem] w-full bg-white flex flex-col p-2 border rounded-xl border-t-0 shadow">
        {/* Messages */}
        <div
          ref={elementRef}
          className="flex flex-col gap-4 h-full w-full mb-2 border-2 rounded-xl p-2 no-scrollbar overflow-y-scroll"
        >
          <Message
            body="I will be going to the festival tomorrow"
            sender={chatUser!}
          />
          <Message body="Okay" sender={chatUser!} />
          <Message body="Okay" sender={chatUser!} />
          <Message body="Okay" sender={chatUser!} />
          <Message
            body="I will be going to the festival tomorrow"
            sender={chatUser!}
          />
          <Message
            body="I will be going to the festival tomorrow"
            sender={chatUser!}
          />
          <Message
            body="I will be going to the festival tomorrow"
            sender={chatUser!}
          />
          <Message
            body="I will be going to the festival tomorrow"
            sender={chatUser!}
          />
          <Message
            body="I will be going to the festival tomorrow"
            sender={chatUser!}
          />
        </div>
        {/* Message input */}
        <div className="flex w-full mt-auto h-17 gap-2 items-center">
          <textarea
            name=""
            id=""
            className="bg-gray-100 focus:outline-primary w-full p-2 rounded-xl border no-scrollbar resize-none"
          />
          <button
            type="button"
            className="bg-primary-lighter p-2 h-fit rounded-lg text-white"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
