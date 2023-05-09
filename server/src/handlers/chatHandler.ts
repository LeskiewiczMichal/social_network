import { Server, Socket } from 'socket.io';
import { MySocket } from '../types';

const registerChatHandlers = (io: Server, socket: MySocket) => {
  const logMessage = () => {
    console.log(socket.user);
  };

  socket.on('message', logMessage);
};

export default registerChatHandlers;
