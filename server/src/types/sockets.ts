import { Server, Socket } from 'socket.io';
import { Request } from 'express';
import { MessageInterface, UserInterfaceWithFriendRequests } from '../models';

interface MySocket extends Socket {
  user?: UserInterfaceWithFriendRequests;
}

interface ServerToClientEvents {
  'message-received': (message: MessageInterface) => void;
}

interface ClientToServerEvents {
  'send-message': (message: MessageInterface) => void;
}

interface RequestWithSocketServer extends Request {
  io: Server;
}

interface InterServerEvents {}

export {
  MySocket,
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  RequestWithSocketServer,
};
