import { Server } from 'socket.io';

import { SocketTypes } from '../../types';
import newFriendRequest from './newFriendRequest';
import addFriend from './addFriend';

const registerFriendHandlers = (io: Server, socket: SocketTypes.MySocket) => {
  socket.on('send-friend-request', (newFriendId) => {
    newFriendRequest({ newFriendId, socket, io });
  });
  socket.on('add-friend', (newFriendId: string) => {
    addFriend({ newFriendId, io, socket });
  });
};

export default registerFriendHandlers;
