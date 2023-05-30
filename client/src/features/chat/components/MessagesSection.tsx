import React, { useState, useRef, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { UserTypes } from '../../users';
import Message from './Message';
import { useAppSelector } from '../../../hooks';
import getMessages from '../services/getMessages';
import { MessageInterface } from '../types/message';
import sendMessage from '../services/sendMessage';
import { LoadingSpinner } from '../../../components';
import { useSocket } from '../../authentication';
import dataToMessageObject from '../utils/dataToMessageObject';
import scrollToBottom from '../utils/scrollToBottom';

interface MessagesSectionProps {
  chatUser: UserTypes.UserInterface;
}

export default function MessagesSection(props: MessagesSectionProps) {
  const { chatUser } = props;
  const socket = useSocket();
  const loggedUser = useAppSelector((state) => state.user);
  const [newMessageBody, setNewMessageBody] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<MessageInterface[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setNewMessageBody(e.target.value);
  };

  const handleSendMessage = async () => {
    // Emit socket event
    if (newMessageBody === '') {
      return;
    }
    await sendMessage({
      socket: socket!,
      body: newMessageBody,
      receiverId: chatUser.id,
    });

    // Create object for new message
    const sentMessage: MessageInterface = {
      id: uuidv4(),
      body: newMessageBody,
      receiver: chatUser.id,
      sender: loggedUser.id!,
      createdAt: new Date(Date.now()),
    };

    // Add to messages
    setMessages((oldMessages) => {
      const newMessages = [...oldMessages];
      newMessages.push(sentMessage);
      return newMessages;
    });

    setNewMessageBody('');
  };

  useEffect(() => {
    // Get initial messages
    const handleGetMessages = async () => {
      setIsLoading(true);
      const queriedMessages = await getMessages({
        friendId: chatUser.id,
        limit: 10,
        offset: 0,
      });
      setMessages(queriedMessages.reverse());
      setIsLoading(false);
    };

    handleGetMessages();
    scrollToBottom({ animation: false, refElement: messagesEnd }); // Scroll to bottom message on start
  }, []);

  // Scroll when new message added
  useEffect(() => {
    scrollToBottom({ animation: true, refElement: messagesEnd });
  }, [messages]);

  // Set socket to listen for new messages
  useEffect(() => {
    const receivedMessage = (messageData: any) => {
      const messageObject = dataToMessageObject(messageData);
      setMessages((oldMessages) => {
        const newMessages = [...oldMessages];
        newMessages.push(messageObject);
        return newMessages;
      });
    };
    socket?.on('message-received', receivedMessage);

    return () => {
      socket?.off('message-received', receivedMessage);
    };
  }, [socket]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
          value={newMessageBody}
          onChange={handleChange}
          className="bg-gray-100 focus:outline-primary w-full p-2 rounded-xl border no-scrollbar resize-none"
        />
        <button
          type="button"
          className="bg-primary-lighter p-2 h-fit rounded-lg text-white"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </section>
  );
}
