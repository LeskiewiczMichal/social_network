import { Server } from 'socket.io';

let socketIO: Server | undefined;

export function setIO(io: Server): void {
  socketIO = io;
}

export function getIO(): Server | undefined {
  return socketIO;
}
