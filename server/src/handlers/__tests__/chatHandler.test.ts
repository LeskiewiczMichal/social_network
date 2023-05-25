import { Server } from 'socket.io';
import { Socket as ClientSocket } from 'socket.io-client';

import * as TestUtils from '../../__testUtils__';
import { SocketTypes } from '../../types';
import { Message } from '../../models';

describe('Chat handlers', () => {
  let io: Server;
  let serverSocket: SocketTypes.MySocket;
  let clientSocket: ClientSocket;
  let db: any;
  let users: any;

  // Config database and server
  beforeAll(async () => {
    const server = await TestUtils.setupSocketServer();
    io = server.io;
    serverSocket = server.serverSocket;
    clientSocket = server.clientSocket;
    db = server.db;
    users = server.users;
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
