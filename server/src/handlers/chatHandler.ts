import { Server } from 'socket.io';
import { MySocket } from '../types';
import { Message, MessageInterface, User, UserInterface } from '../models';

const registerChatHandlers = (io: Server, socket: MySocket) => {
  const newMessage = async (msg: MessageInterface) => {
    try {
      const receiver = (await User.findById(msg.receiver)) as UserInterface;

      const message = new Message({
        body: msg.body,
        sender: msg.sender,
        receiver: msg.receiver,
      });

      await message.save();

      if (receiver.socketId) {
        await (await message.populate('receiver')).populate('sender');
        io.to(receiver.socketId).emit('message-received', message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  socket.on('send-message', newMessage);
};

export default registerChatHandlers;
