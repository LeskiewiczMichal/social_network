import * as dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import { messageRouter } from '..';
import { serverConfig } from '../../middleware';
import * as TestUtils from '../../__testUtils__';

// Config test server
dotenv.config();
const app = express();
serverConfig(app);
app.use('/', messageRouter);

const clearDB = async () => {
  await TestUtils.deleteAllMessages();
};

describe('Comments route tests', () => {
  let users: any;
  let messages: any;
  let db: any;
  let errorSpy: jest.SpyInstance; // This disables console error

  // Set up database
  beforeAll(async () => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      db = await TestUtils.initializeMongoServer();
      users = await TestUtils.createFakeUsers(
        TestUtils.CONSTANTS.DEFAULT_USERS_PROPS,
      );
    } catch (error) {
      console.error(error);
    }
  });

  // Stop server
  afterAll(async () => {
    await db.stop();
    errorSpy.mockRestore();
  });

  describe('Querying messages', () => {
    beforeAll(async () => {
      messages = await TestUtils.createFakeMessages({
        ...TestUtils.CONSTANTS.DEFAULT_MESSAGES_PROPS,
      });
    });

    afterAll(clearDB);

    test('returns error when no friend/user id provided', (done) => {
      request(app)
        .get(`/`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            error: 'No user id or friend id provided',
          });
        })

        .expect(400, done);
    });

    test('returns messages on success', (done) => {
      request(app)
        .get(`/?friendId=${TestUtils.CONSTANTS.USER_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            messages: [{ ...messages.one }, { ...messages.two }],
          });
        })
        .expect(200, done);
    });

    test('returns limited messages when query added', (done) => {
      request(app)
        .get(`/?friendId=${TestUtils.CONSTANTS.USER_IDS.one}&limit=1`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            messages: [{ ...messages.one }],
          });
        })
        .expect(200, done);
    });
  });
});
