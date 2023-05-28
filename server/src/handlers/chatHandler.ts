import { Server } from 'socket.io';
import { SocketTypes } from '../types';
import { Message, MessageInterface, User, UserInterface } from '../models';

interface NewMessageProps {
  body: string;
  receiverId: string;
}

const registerChatHandlers = (io: Server, socket: SocketTypes.MySocket) => {
  const newMessage = async (props: NewMessageProps) => {
    try {
      if (!socket.user) {
        return;
      }
      const { body, receiverId } = props;
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

  socket.on('send-message', newMessage);
};

export default registerChatHandlers;
