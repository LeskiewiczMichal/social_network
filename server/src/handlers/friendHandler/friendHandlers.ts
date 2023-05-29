import { Server } from 'socket.io';

import { SocketTypes } from '../../types';
import newFriendRequest from './newFriendRequest';
import addFriend from './addFriend';

interface SendFriendData {
  newFriendId: string;
}

interface AddFriendData {
  newFriendId: string;
}

const registerFriendHandlers = (io: Server, socket: SocketTypes.MySocket) => {
  socket.on('send-friend-request', (data: SendFriendData) => {
    newFriendRequest({ newFriendId: data.newFriendId, socket, io });
  });
  socket.on('add-friend', (data: AddFriendData) => {
    addFriend({ newFriendId: data.newFriendId, io, socket });
  });
};

export default registerFriendHandlers;
