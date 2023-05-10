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
        // notificationHandlers(io, socket);
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

  test('Sending and receiving messages', (done) => {
    clientSocket.on('message-received', (arg) => {
      try {
        console.log(arg);
        expect(arg).toMatchObject({
          body: 'test',
          sender: users.one,
          receiver: users.one,
        });
        done();
      } catch (err) {
        console.error(err);
        done(err);
      }
    });

    clientSocket.emit('send-message', {
      body: 'test',
      receiver: TEST_CONSTANTS.USER_IDS.one,
      sender: TEST_CONSTANTS.USER_IDS.one,
    });
  });
});
