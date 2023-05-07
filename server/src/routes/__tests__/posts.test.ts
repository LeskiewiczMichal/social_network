import * as dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { postsRouter } from '..';
import { serverConfig } from '../../middleware';
import { Post } from '../../models';
import {
  deleteAllPosts,
  initializeMongoServer,
  createFakeUsers,
} from '../../__testUtils__';

dotenv.config();
const app = express();
serverConfig(app);
app.use('/', postsRouter);

const IDS = {
  one: new mongoose.Types.ObjectId(),
  two: new mongoose.Types.ObjectId(),
  three: new mongoose.Types.ObjectId(),
};
const defaultUsers = { userOne: {}, userTwo: {}, userThree: {}, ids: IDS };

describe('Posts route tests', () => {
  let users: any;
  let db: any;
  let errorSpy: jest.SpyInstance; // This disables console error

  // Set up database
  beforeAll(async () => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      db = await initializeMongoServer();
      users = await createFakeUsers(defaultUsers);
    } catch (error) {
      console.error(error);
    }
  });

  // Stop server
  afterAll(async () => {
    await db.stop();
    errorSpy.mockRestore();
  });

//   describe('Querying posts', () => {
//     afterAll(deleteAllPosts);
//   })

  describe('Create post', () => {
    afterAll(deleteAllPosts);

    test('returns status 400 on body not provided', (done) => {
      request(app)
        .post('/')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not all neccessery fields were provided' })
        .expect(400, done);
    });

    test('returns post on success', (done) => {
      const requestBody = {
        title: 'Testing',
        body: 'This post is for testing',
        author: IDS.one,
      };
      request(app)
        .post('/')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            post: {
              title: 'Testing',
              body: 'This post is for testing',
              author: IDS.one.toString(),
            },
          });
        })
        .expect(200, done);
    });
  });


});
