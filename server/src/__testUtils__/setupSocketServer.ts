import dotenv from 'dotenv';
import express from 'express';
import { AddressInfo } from 'net';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Manager } from 'socket.io-client';

import initializeMongoServer from './mongoConfigTesting';
import createFakeUsers from './createFakeUsers';
import { CONSTANTS } from '.';
import { serverConfig } from '../middleware';
import { SocketTypes } from '../types';
import * as EventHandlers from '../handlers';

export default async function setupSocketServer() {
  dotenv.config();
  const db = await initializeMongoServer();
  const users = await createFakeUsers(CONSTANTS.DEFAULT_USERS_PROPS);
  const app = express();
  const httpServer = createServer(app);
  const io = new Server<
    SocketTypes.ClientToServerEvents,
    SocketTypes.ServerToClientEvents,
    SocketTypes.InterServerEvents,
    SocketTypes.MySocket
  >(httpServer, {
    cors: {
      origin: '*',
    },
  });
  serverConfig(app);

  io.use(EventHandlers.authenticationHandler);
  io.on('connection', (socket: SocketTypes.MySocket) => {
    EventHandlers.registerChatHandlers(io, socket);
    EventHandlers.registerDisconnectHandlers(io, socket);
    EventHandlers.registerFriendHandlers(io, socket);
  });

  let serverSocket: SocketTypes.MySocket;
  let clientSocket: ReturnType<Manager['socket']>;
  await new Promise<void>((resolve, reject) => {
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      io.on('connection', (socket: SocketTypes.MySocket) => {
        serverSocket = socket;
      });
      clientSocket = new Manager(`http://localhost:${port}`).socket('/', {
        auth: { token: `Bearer ${users.tokens.one}` },
      });
      clientSocket.on('connect', resolve);
      clientSocket.on('connect-error', (error) => reject(error));
    });
  });

  return {
    io,
    serverSocket: serverSocket!,
    clientSocket: clientSocket!,
    db,
    users,
  };
}
