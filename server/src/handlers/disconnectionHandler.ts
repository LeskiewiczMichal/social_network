import { Server } from 'socket.io';
import { MySocket } from '../types';
import { User, UserInterface } from '../models';

const registerDisconnectHandlers = (io: Server, socket: MySocket) => {
  socket.on('disconnect', async () => {
    try {
      const { id: userId } = socket.user as UserInterface;

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('chuj');
      }
      user.socketId = null;
      await user.save();
    } catch (error) {
      console.error(error);
    }
  });
};

export default registerDisconnectHandlers;
