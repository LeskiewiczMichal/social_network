import { Server } from 'socket.io';
import { SocketTypes } from '../../types';
import newMessage from './newMessage';

const registerChatHandlers = (io: Server, socket: SocketTypes.MySocket) => {
  socket.on('send-message', (data) => {
    newMessage({ socket, io, body: data.body, receiverId: data.receiverId });
  });
};

export default registerChatHandlers;
