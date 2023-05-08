import * as dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { postsRouter } from '..';
import { serverConfig } from '../../middleware';
import { Comment, Post } from '../../models';
import {
  deleteAllPosts,
  deleteAllComments,
  initializeMongoServer,
  createFakeUsers,
  createFakePosts,
  USER_IDS,
  POST_IDS,
  DEFAULT_USERS_PROPS,
  DEFAULT_POSTS_PROPS,
} from '../../__testUtils__';

dotenv.config();
const app = express();
serverConfig(app);
app.use('/', postsRouter);

describe('Comments route tests', () => {
  let posts: any;
  let users: any;
  let db: any;
  let errorSpy: jest.SpyInstance; // This disables console error

  // Set up database
  beforeAll(async () => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      db = await initializeMongoServer();
      users = await createFakeUsers(DEFAULT_USERS_PROPS);
      posts = await createFakePosts(DEFAULT_POSTS_PROPS);
    } catch (error) {
      console.error(error);
    }
  });

  // Stop server
  afterAll(async () => {
    await db.stop();
    errorSpy.mockRestore();
  });

  describe('Create comment', () => {
    afterAll(deleteAllComments);

    test('returns status 400 on body not provided', (done) => {
      request(app)
        .post(`/${POST_IDS.one}/comments`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not all neccessery fields were provided' })
        .expect(400, done);
    });

    test('returns status 404 if post is not found', (done) => {
      const requestBody = { body: 'This is test comment' };
      request(app)
        .post('/000/comments')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect({ error: 'Post not found' })
        .expect(404, done);
    });

    test('return comment on success', (done) => {
      const requestBody = { body: 'This is test comment' };
      request(app)
        .post(`/${POST_IDS.one}/comments`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: 'Comment successfully created',
            comment: {
              body: requestBody.body,
              author: USER_IDS.one.toString(),
              likes: [],
              post: POST_IDS.one.toString(),
            },
          });
        })
        .expect(200, done);
    });
  });
});
