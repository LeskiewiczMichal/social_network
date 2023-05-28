import React, { useState, useRef, useEffect } from 'react';

import { UserTypes } from '../../users';
import Message from './Message';
import { useAppSelector } from '../../../hooks';
import getMessages from '../services/getMessages';
import { MessageInterface } from '../types/message';
import sendMessage from '../eventHandlers/sendMessage';
import { LoadingSpinner } from '../../../components';
import { useSocket } from '../../authentication';

interface MessagesSectionProps {
  chatUser: UserTypes.UserInterface;
}

export default function MessagesSection(props: MessagesSectionProps) {
  const { chatUser } = props;
  const socket = useSocket();
  const loggedUser = useAppSelector((state) => state.user);
  const [newMessage, setNewMessage] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<MessageInterface[]>([]);

  const scrollToBottom = () => {
    if (!messagesEnd || !messagesEnd.current) {
      return;
    }
    messagesEnd.current.scrollIntoView();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    // Get messages
    const handleGetMessages = async () => {
      setIsLoading(true);
      const queriedMessages = await getMessages({
        friendId: chatUser.id,
        limit: 10,
        offset: 0,
      });
      setMessages(queriedMessages);
      setIsLoading(false);
    };

    handleGetMessages();
    scrollToBottom(); // Scroll to bottom message on start
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
        {messages.map((message: MessageInterface) => {
          return (
            <Message
              key={message.id}
              body={message.body}
              sender={message.sender === loggedUser.id ? loggedUser : chatUser}
            />
          );
        })}

        <div style={{ float: 'left', clear: 'both' }} ref={messagesEnd} />
      </div>
      {/* Message input */}
      <div className="flex w-full mt-auto h-17 gap-2 items-center">
        <textarea
          name="newMessageBody"
          id="newMessageBody"
          value={newMessage}
          onChange={handleChange}
          className="bg-gray-100 focus:outline-primary w-full p-2 rounded-xl border no-scrollbar resize-none"
        />
        <button
          type="button"
          className="bg-primary-lighter p-2 h-fit rounded-lg text-white"
          onClick={() =>
            sendMessage({
              socket: socket!,
              body: newMessage,
              receiverId: chatUser.id,
            })
          }
        >
          Send
        </button>
      </div>
    </section>
  );
}
