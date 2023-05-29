import { Socket } from 'socket.io-client';

interface SendFriendRequestProps {
  socket: Socket | null;
  newFriendId: string;
}

const sendFriendRequest = (props: SendFriendRequestProps) => {
  const { socket, newFriendId } = props;

  if (!socket) {
    return;
  }

  socket.timeout(5000).emit('send-friend-request', { newFriendId });
};

export default sendFriendRequest;
