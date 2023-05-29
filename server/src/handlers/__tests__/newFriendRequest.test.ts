import { Server } from 'socket.io';
import { Socket as ClientSocket } from 'socket.io-client';

import * as TestUtils from '../../__testUtils__';
import { SocketTypes } from '../../types';
import Notification, { NotificationTypes } from '../../models/notification';
import { User } from '../../models';

describe('Friend handlers', () => {
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

  test('Sending friend requests and receiving notification', (done) => {
    clientSocket.on('new-notification', (notification) => {
      try {
        // Notification received
        expect(notification).toMatchObject({
          type: NotificationTypes.FRIEND_REQUEST,
          sender: TestUtils.CONSTANTS.USER_IDS.one.toString(),
          receiver: TestUtils.CONSTANTS.USER_IDS.one.toString(),
        });
        // Notification added to DB
        Notification.findById(notification._id).then((notificationInDb) => {
          if (!notificationInDb) {
            throw new Error('Notification not found in database');
          }
        });
        // Friend request appended to user
        User.findById(TestUtils.CONSTANTS.USER_IDS.one.toString())
          .select('+friendRequests')
          .then((user) => {
            if (user) {
              expect(user.friendRequests).toMatchObject([
                TestUtils.CONSTANTS.USER_IDS.one,
              ]);
            }
          });
        done();
      } catch (err) {
        console.error(err);
        done(err);
      }
    });

    clientSocket.emit('send-friend-request', {
      newFriendId: TestUtils.CONSTANTS.USER_IDS.one.toString(),
    });
  });
});
