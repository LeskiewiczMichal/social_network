import * as dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import { postsRouter } from '..';
import { serverConfig } from '../../middleware';
import { Comment } from '../../models';
import * as TestUtils from '../../__testUtils__';

// Config test server
dotenv.config();
const app = express();
serverConfig(app);
app.use('/', postsRouter);

const clearDB = async () => {
  await TestUtils.deleteAllPosts();
  await TestUtils.deleteAllComments();
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

  describe('Querying posts', () => {
    beforeAll(async () => {
      try {
        posts = await TestUtils.createFakePosts(
          TestUtils.CONSTANTS.DEFAULT_POSTS_PROPS,
        );
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
            posts: [
              { ...posts.one, author: users.one },
              { ...posts.two, author: users.one },
              { ...posts.three, author: users.one },
            ],
          });
        })
        .expect(200, done);
    });

    test('Get single post by id', (done) => {
      request(app)
        .get(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
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
        .expect({ error: 'Missing required body field: title' })
        .expect(400, done);
    });

    test('returns post on success', (done) => {
      const requestBody = {
        title: 'Testing',
        body: 'This post is for testing',
        author: TestUtils.CONSTANTS.USER_IDS.one,
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
              author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Update post', () => {
    beforeAll(async () => {
      try {
        posts = await TestUtils.createFakePosts(
          TestUtils.CONSTANTS.DEFAULT_POSTS_PROPS,
        );
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(clearDB);

    test("returns status 401 if user is not post's creator", (done) => {
      const requestBody = { title: 'Modified', body: 'modified' };
      request(app)
        .put(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect({ error: 'Unauthorized' })
        .expect(401, done);
    });

    test('returns status 404 if post is not found', (done) => {
      request(app)
        .put('/000')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test('returns modified post on success', (done) => {
      const requestBody = { title: 'Modified', body: 'modified' };
      request(app)
        .put(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
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

    test('post liking functionality', (done) => {
      request(app)
        .put(`/${TestUtils.CONSTANTS.POST_IDS.one}?like=${users.one._id}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            post: {
              likes: [users.one._id],
            },
          });
        })
        .expect(200, done);
    });

    test('posts disliking', (done) => {
      request(app)
        .put(`/${TestUtils.CONSTANTS.POST_IDS.one}?like=${users.one._id}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            post: {
              likes: [],
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Delete posts', () => {
    beforeAll(async () => {
      try {
        posts = await TestUtils.createFakePosts(
          TestUtils.CONSTANTS.DEFAULT_POSTS_PROPS,
        );
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(clearDB);

    test("returns status 401 if user is not post's creator", (done) => {
      request(app)
        .delete(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
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
        .delete(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect(200, () => {
          Comment.find({ post: TestUtils.CONSTANTS.POST_IDS.one })
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
        .delete(`/${TestUtils.CONSTANTS.POST_IDS.two}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Post deleted successfully' })
        .expect(200, done);
    });
  });
});
