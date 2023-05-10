import * as dotenv from 'dotenv';
import express from 'express';
import { AddressInfo } from 'net';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Socket as ClientSocket, Manager } from 'socket.io-client';
import {
  initializeMongoServer,
  createFakeUsers,
  TEST_CONSTANTS,
} from '../../__testUtils__';
import { serverConfig } from '../../middleware';
import { MySocket } from '../../types';
import {
  registerChatHandlers,
  authenticationHandler,
  registerDisconnectHandlers,
} from '..';
import { User } from '../../models';

describe('User authentication handlers', () => {
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
        registerDisconnectHandlers(io, socket);
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

  test('User in database has updated socketId when connected', (done) => {
    User.findById(TEST_CONSTANTS.USER_IDS.one)
      .then((user) => {
        if (user) {
          expect(user.socketId).not.toBeNull();
          done();
        } else {
          throw new Error('User not found');
        }
      })
      .catch((err) => {
        console.error(err);
        done(err);
      });
  });

  test('User in database socketId is null when disconnected', (done) => {
    clientSocket.close();

    setTimeout(() => {
      User.findById(TEST_CONSTANTS.USER_IDS.one)
        .then((user) => {
          if (user) {
            expect(user.socketId).toBeNull();
            done();
          } else {
            throw new Error('User not found');
          }
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    }, 500);
  });
});
