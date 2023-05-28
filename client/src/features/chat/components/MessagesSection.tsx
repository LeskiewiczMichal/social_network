import { useState, useRef, useEffect } from 'react';

import { UserTypes } from '../../users';
import Message from './Message';
import { useAppSelector } from '../../../hooks';

interface MessagesSectionProps {
  chatUser: UserTypes.UserInterface;
}

export default function MessagesSection(props: MessagesSectionProps) {
  const { chatUser } = props;
  const socket = useAppSelector((state) => state.socket.socket);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEnd = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (!messagesEnd || !messagesEnd.current) {
      return;
    }
    messagesEnd.current.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom message on start

    // Get messages
  }, [socket]);

  // Set socket to listen for new messages
  // useEffect(() => {
  // socket?.on('');
  // }, [socket]);

  // useEffect(() => {
  //   const element = elementRef.current;
  //   if (!element) return;

  //   element.scrollTop != element.scrollHeight;
  // }, [isLoading]);

  return (
    <section className="h-[34rem] w-full bg-white flex flex-col p-2 border rounded-xl border-t-0 shadow">
      {/* Messages */}
      <div className="flex flex-col gap-4 h-full w-full mb-2 px-2 py-1 border-2 rounded-xl  no-scrollbar overflow-y-scroll ">
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
        <div style={{ float: 'left', clear: 'both' }} ref={messagesEnd} />
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
    </section>
  );
}
