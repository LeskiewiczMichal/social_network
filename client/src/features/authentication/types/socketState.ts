import { Socket } from 'socket.io-client';

export interface SocketState {
  socket: Socket | null;
}
