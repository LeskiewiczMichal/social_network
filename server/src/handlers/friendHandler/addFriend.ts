import { Server } from 'socket.io';

import {
  Notification,
  UserInterface,
  User,
  NotificationInterface,
} from '../../models';
import { NotificationTypes } from '../../models/notification';
import { ErrorTypes, SocketTypes } from '../../types';

interface AddFriendRequestProps {
  newFriendId: string;
  io: Server;
  socket: SocketTypes.MySocket;
}

const addFriend = async (props: AddFriendRequestProps) => {
  try {
    const { newFriendId, io, socket } = props;
    const { user } = socket;
    if (!user || newFriendId === user.id) {
      return;
    }

    const friend = (await User.findById(newFriendId)) as UserInterface;

    // Remove from friend requests
    const friendIdIndex = user.friendRequests?.indexOf(friend.id);
    if (friendIdIndex !== -1) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      user.friendRequests!.splice(friendIdIndex!, 1)[0];
    } else {
      throw new ErrorTypes.BadRequestError(
        "User was not on friend's requests list",
      );
    }

    // Add to friends
    user.friends.push(friend.id);
    await user.save();

    // Create notification
    const newNotification: NotificationInterface = new Notification({
      receiver: friend.id,
      sender: user.id,
      type: NotificationTypes.NEW_FRIEND,
    });
    await newNotification.save();

    // If receiver is active emit a notification
    if (friend.socketId) {
      // await (await messageObject.populate('receiver')).populate('sender');
      io.to(friend.socketId).emit('new-notification', newNotification);
    }
  } catch (err: any) {
    console.error(err);
  }
};

export default addFriend;
