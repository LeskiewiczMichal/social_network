import { Socket } from 'socket.io';
import { MessageInterface, UserInterface } from '../models';

interface MySocket extends Socket {
  user?: UserInterface;
}

interface ServerToClientEvents {
  'message-received': (message: MessageInterface) => void;
}

interface ClientToServerEvents {
  'send-message': (message: MessageInterface) => void;
}

interface InterServerEvents {}

export {
  MySocket,
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
};
