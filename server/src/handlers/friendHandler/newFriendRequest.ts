import { Server } from 'socket.io';

import {
  User,
  UserInterfaceWithFriendRequests,
  NotificationInterface,
  Notification,
} from '../../models';
import { NotificationTypes } from '../../models/notification';
import { SocketTypes } from '../../types';

interface NewFriendRequestProps {
  newFriendId: string;
  io: Server;
  socket: SocketTypes.MySocket;
}

const newFriendRequest = async (props: NewFriendRequestProps) => {
  try {
    const { socket, io, newFriendId } = props;
    if (!socket.user || newFriendId === socket.user.id) {
      return;
    }
    const userId = socket.user.id;
    const friend = (await User.findById(newFriendId).select(
      '+friendRequests',
    )) as UserInterfaceWithFriendRequests;

    // Check if user is not already in requests.
    if (friend.friendRequests.includes(userId)) {
      return;
    }

    friend.friendRequests.push(userId);
    await friend.save();

    const newNotification: NotificationInterface = new Notification({
      receiver: friend.id,
      sender: userId,
      type: NotificationTypes.FRIEND_REQUEST,
    });
    await newNotification.save();

    // If receiver is active emit a notification
    if (friend.socketId) {
      await newNotification.populate('sender');
      // await (await messageObject.populate('receiver')).populate('sender');
      io.to(friend.socketId).emit('new-notification', newNotification);
    }
  } catch (error) {
    console.error(error);
  }
};

export default newFriendRequest;
