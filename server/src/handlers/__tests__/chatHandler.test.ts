import * as dotenv from 'dotenv';
import express from 'express';
import { AddressInfo } from 'net';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { Socket as ClientSocket, Manager } from 'socket.io-client';
import {
  initializeMongoServer,
  createFakeUsers,
  TEST_CONSTANTS,
} from '../../__testUtils__';
import { serverConfig } from '../../middleware';
import { MySocket } from '../../types';
import { registerChatHandlers, authenticationHandler } from '..';
import { User } from '../../models';

describe('Chat handlers', () => {
  let io: Server;
  let serverSocket: MySocket;
  let clientSocket: ClientSocket;
  let db: any;
  let users: any;

  // Config database and server
  beforeAll(async () => {
    try {
      dotenv.config();
      db = await initializeMongoServer();
      users = await createFakeUsers(TEST_CONSTANTS.DEFAULT_USERS_PROPS);
      const app = express();
      const httpServer = createServer(app);
      io = new Server(httpServer, {
        cors: {
          origin: '*',
        },
      });
      serverConfig(app);

      io.use(authenticationHandler);

      io.on('connection', (socket: MySocket) => {
        registerChatHandlers(io, socket);
      });

      await new Promise<void>((resolve, reject) => {
        httpServer.listen(() => {
          const { port } = httpServer.address() as AddressInfo;
          io.on('connection', (socket: MySocket) => {
            serverSocket = socket;
          });
          clientSocket = new Manager(`http://localhost:${port}`).socket('/', {
            auth: { token: users.tokens.one },
          });
          clientSocket.on('connect', resolve);
          clientSocket.on('connect-error', (error) => reject(error));
        });
      });
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    io.close();
    clientSocket.close();
  });

  test('should work', (done) => {
    clientSocket.on('hello', (arg) => {
      expect(arg).toBe('world');
      done();
    });
    serverSocket.emit('hello', 'world');
  });

  test('console log', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});

    clientSocket.emit('message');

    // Wait for a short delay before checking the console output
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(console.log).toHaveBeenCalledWith('OK');

    jest.restoreAllMocks();
  });
});
