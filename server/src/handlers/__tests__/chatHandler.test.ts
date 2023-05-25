import * as dotenv from 'dotenv';
import express from 'express';
import { AddressInfo } from 'net';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Socket as ClientSocket, Manager } from 'socket.io-client';

import * as TestUtils from '../../__testUtils__';
import { serverConfig } from '../../middleware';
import { SocketTypes } from '../../types';
import * as EventHandlers from '..';
import { Message } from '../../models';

describe('Chat handlers', () => {
  let io: Server;
  let serverSocket: SocketTypes.MySocket;
  let clientSocket: ClientSocket;
  let db: any;
  let users: any;

  // Config database and server
  beforeAll(async () => {
    try {
      dotenv.config();
      db = await TestUtils.initializeMongoServer();
      users = await TestUtils.createFakeUsers(
        TestUtils.CONSTANTS.DEFAULT_USERS_PROPS,
      );
      const app = express();
      const httpServer = createServer(app);
      io = new Server<
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
      });

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
          clientSocket.on('connect-error', (error) => {
            console.error('Client socket connetion serror: ', error);
            reject(error);
          });
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
    clientSocket.on('message-received', (msg) => {
      try {
        expect(msg).toMatchObject({
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
      receiver: TestUtils.CONSTANTS.USER_IDS.one,
      sender: TestUtils.CONSTANTS.USER_IDS.one,
    });
  });

  test('creates new message in database', (done) => {
    clientSocket.on('message-received', (msg) => {
      try {
        Message.findById(msg._id).then((message) => {
          if (message) {
            expect(message).toMatchObject({
              body: 'test',
              sender: TestUtils.CONSTANTS.USER_IDS.one,
              receiver: TestUtils.CONSTANTS.USER_IDS.one,
            });
            done();
          } else {
            throw new Error('Message not found in database');
          }
        });
      } catch (err) {
        console.error(err);
        done(err);
      }
    });

    clientSocket.emit('send-message', {
      body: 'test',
      receiver: TestUtils.CONSTANTS.USER_IDS.one,
      sender: TestUtils.CONSTANTS.USER_IDS.one,
    });
  });
});
