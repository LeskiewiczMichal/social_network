import * as dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import { postsRouter } from '..';
import { serverConfig } from '../../middleware';
import { Comment } from '../../models';
import {
  deleteAllPosts,
  deleteAllComments,
  initializeMongoServer,
  createFakeUsers,
  createFakePosts,
  TEST_CONSTANTS,
} from '../../__testUtils__';

// Config test server
dotenv.config();
const app = express();
serverConfig(app);
app.use('/', postsRouter);

const clearDB = async () => {
  await deleteAllPosts();
  await deleteAllComments();
};

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
      users = await createFakeUsers(TEST_CONSTANTS.DEFAULT_USERS_PROPS);
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
        posts = await createFakePosts(TEST_CONSTANTS.DEFAULT_POSTS_PROPS);
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(clearDB);

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
        .get(`/${TEST_CONSTANTS.POST_IDS.one}`)
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
        .expect({ error: 'Not found' })
        .expect(404, done);
    });
  });

  describe('Create post', () => {
    afterAll(clearDB);

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
        author: TEST_CONSTANTS.USER_IDS.one,
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
              author: TEST_CONSTANTS.USER_IDS.one.toString(),
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Update post', () => {
    beforeAll(async () => {
      try {
        posts = await createFakePosts(TEST_CONSTANTS.DEFAULT_POSTS_PROPS);
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(clearDB);

    test("returns status 401 if user is not post's creator", (done) => {
      request(app)
        .put(`/${TEST_CONSTANTS.POST_IDS.one}`)
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
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test('returns modified post on success', (done) => {
      const requestBody = { title: 'Modified', body: 'modified' };
      request(app)
        .put(`/${TEST_CONSTANTS.POST_IDS.one}`)
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

  describe('Delete posts', () => {
    beforeAll(async () => {
      try {
        posts = await createFakePosts(TEST_CONSTANTS.DEFAULT_POSTS_PROPS);
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(clearDB);

    test("returns status 401 if user is not post's creator", (done) => {
      request(app)
        .delete(`/${TEST_CONSTANTS.POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Unauthorized' })
        .expect(401, done);
    });

    test('returns status 404 if post is not found', (done) => {
      request(app)
        .delete('/000')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test("deletes all post's comments", (done) => {
      request(app)
        .delete(`/${TEST_CONSTANTS.POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect(200, () => {
          Comment.find({ post: TEST_CONSTANTS.POST_IDS.one })
            .then((docs) => {
              expect(docs).toHaveLength(0);
              done();
            })
            .catch((error) => {
              console.error(error);
              done(error);
            });
        });
    });

    test('returns message on success', (done) => {
      request(app)
        .delete(`/${TEST_CONSTANTS.POST_IDS.two}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Post deleted successfully' })
        .expect(200, done);
    });
  });

  describe('Like post', () => {
    beforeAll(async () => {
      try {
        posts = await createFakePosts({
          postOne: {},
          postTwo: {
            likes: [TEST_CONSTANTS.USER_IDS.two, TEST_CONSTANTS.USER_IDS.three],
          },
          postThree: {},
          postIds: TEST_CONSTANTS.POST_IDS,
          authorId: TEST_CONSTANTS.USER_IDS.one,
        });
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(clearDB);

    test('returns status 404 if post is not found', (done) => {
      request(app)
        .post('/000/likes')
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test('retuns status 400 if post already liked', (done) => {
      request(app)
        .post(`/${TEST_CONSTANTS.POST_IDS.two}/likes`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Post is already liked' })
        .expect(400, done);
    });

    test('retuns message on success', (done) => {
      request(app)
        .post(`/${TEST_CONSTANTS.POST_IDS.one}/likes`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Post liked successfully' })
        .expect(200, done);
    });
  });

  describe('Dislike post', () => {
    beforeAll(async () => {
      try {
        posts = await createFakePosts({
          postOne: {},
          postTwo: {
            likes: [TEST_CONSTANTS.USER_IDS.two, TEST_CONSTANTS.USER_IDS.three],
          },
          postThree: {},
          postIds: TEST_CONSTANTS.POST_IDS,
          authorId: TEST_CONSTANTS.USER_IDS.one,
        });
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(clearDB);

    test('returns status 404 if post is not found', (done) => {
      request(app)
        .delete('/000/likes')
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test('retuns status 400 if post is not liked', (done) => {
      request(app)
        .delete(`/${TEST_CONSTANTS.POST_IDS.two}/likes`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Post is not liked' })
        .expect(400, done);
    });

    test('retuns message on success', (done) => {
      request(app)
        .delete(`/${TEST_CONSTANTS.POST_IDS.two}/likes`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Post unliked successfully' })
        .expect(200, done);
    });
  });
});
