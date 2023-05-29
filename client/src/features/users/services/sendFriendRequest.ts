import { Socket } from 'socket.io-client';

interface SendFriendRequestProps {
  socket: Socket;
  newFriendId: string;
}

const sendFriendRequest = (props: SendFriendRequestProps) => {
  const { socket, newFriendId } = props;

  socket.timeout(5000).emit('send-friend-request', { newFriendId });
};

export default sendFriendRequest;
