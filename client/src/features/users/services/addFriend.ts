import { Socket } from 'socket.io-client';

interface AddFriendProps {
  socket: Socket | null;
  newFriendId: string;
}

const addFriend = (props: AddFriendProps) => {
  const { socket, newFriendId } = props;

  if (!socket) {
    return;
  }

  socket.timeout(5000).emit('add-friend', { newFriendId });
};

export default addFriend;
