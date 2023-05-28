/* eslint-disable react/function-component-definition */
import React, { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

interface SocketProviderProps {
  socket: Socket | null;
  children: React.ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  socket,
}) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
