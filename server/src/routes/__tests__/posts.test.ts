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

describe('Posts route tests', () => {
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
    } catch (error) {
      console.error(error);
    }
  });

  // Stop server
  afterAll(async () => {
    await db.stop();
    errorSpy.mockRestore();
  });

  describe('Querying posts', () => {
    beforeAll(async () => {
      try {
        posts = await createFakePosts(DEFAULT_POSTS_PROPS);
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(deleteAllPosts);

    test('Get all posts', (done) => {
      request(app)
        .get('/')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            posts: [posts.one, posts.two, posts.three],
          });
        })
        .expect(200, done);
    });

    test('Get single post by id', (done) => {
      request(app)
        .get(`/${POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            post: posts.one,
          });
        })
        .expect(200, done);
    });

    test("returns status 404 if post with given id doesn't exist", (done) => {
      request(app)
        .get('/000')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Post not found' })
        .expect(404, done);
    });
  });

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
        author: USER_IDS.one,
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
              author: USER_IDS.one.toString(),
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Update post', () => {
    beforeAll(async () => {
      try {
        posts = await createFakePosts(DEFAULT_POSTS_PROPS);
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(deleteAllPosts);

    test("returns status 401 if user is not post's creator", (done) => {
      request(app)
        .put(`/${POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Unauthorized' })
        .expect(401, done);
    });

    test('returns status 404 if post is not found', (done) => {
      request(app)
        .put('/000')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Post not found' })
        .expect(404, done);
    });

    test('returns modified post on success', (done) => {
      const requestBody = { title: 'Modified', body: 'modified' };
      request(app)
        .put(`/${POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            post: {
              title: 'Modified',
              body: 'modified',
            },
          });
        })
        .expect(200, done);
    });
  });
});
