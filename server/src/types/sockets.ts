import { Socket } from 'socket.io';
import { UserInterface } from '../models';

interface MySocket extends Socket {
  user?: UserInterface;
}

export { MySocket };
