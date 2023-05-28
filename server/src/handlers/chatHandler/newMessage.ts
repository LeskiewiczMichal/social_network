import { Server } from 'socket.io';

import { User, UserInterface, MessageInterface, Message } from '../../models';
import { SocketTypes } from '../../types';

interface NewMessageProps {
  body: string;
  receiverId: string;
  io: Server;
  socket: SocketTypes.MySocket;
}

const newMessage = async (props: NewMessageProps) => {
  try {
    const { socket, body, receiverId, io } = props;
    if (!socket.user) {
      return;
    }
    const receiver = (await User.findById(receiverId)) as UserInterface;

    const messageObject: MessageInterface = new Message({
      body,
      sender: socket.user.id,
      receiver: receiverId,
    });

    await messageObject.save();

    // If receiver is active emit a notification
    if (receiver.socketId) {
      // await (await messageObject.populate('receiver')).populate('sender');
      io.to(receiver.socketId).emit('message-received', messageObject);
    }
  } catch (error) {
    console.error(error);
  }
};

export default newMessage;
