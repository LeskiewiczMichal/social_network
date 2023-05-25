import { Server } from 'socket.io';
import { Socket as ClientSocket } from 'socket.io-client';

import * as TestUtils from '../../__testUtils__';
import { SocketTypes } from '../../types';
import { User } from '../../models';

describe('User authentication handlers', () => {
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

  test('User in database has updated socketId when connected', (done) => {
    User.findById(TestUtils.CONSTANTS.USER_IDS.one)
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
      User.findById(TestUtils.CONSTANTS.USER_IDS.one)
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
