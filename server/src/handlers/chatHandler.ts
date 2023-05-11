import { Server } from 'socket.io';
import { SocketTypes } from '../types';
import { Message, MessageInterface, User, UserInterface } from '../models';

const registerChatHandlers = (io: Server, socket: SocketTypes.MySocket) => {
  const newMessage = async (message: MessageInterface) => {
    try {
      const receiver = (await User.findById(message.receiver)) as UserInterface;

      const messageObject: MessageInterface = new Message({
        body: message.body,
        sender: message.sender,
        receiver: message.receiver,
      });

      await messageObject.save();

      if (receiver.socketId) {
        await (await messageObject.populate('receiver')).populate('sender');
        io.to(receiver.socketId).emit('message-received', messageObject);
      }
    } catch (error) {
      console.error(error);
    }
  };

  socket.on('send-message', newMessage);
};

export default registerChatHandlers;
