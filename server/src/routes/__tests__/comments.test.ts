import * as dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { commentsRouter } from '..';
import { serverConfig } from '../../middleware';
import { Comment, Post } from '../../models';
import {
  deleteAllPosts,
  deleteAllComments,
  initializeMongoServer,
  createFakeUsers,
  createFakePosts,
  TEST_CONSTANTS,
  deleteAllUsers,
} from '../../__testUtils__';
import createFakeComments from '../../__testUtils__/createFakeComments';
import { COMMENT_IDS } from '../../__testUtils__/constants';

dotenv.config();
const app = express();
serverConfig(app);
app.use('/', commentsRouter);

const clearDB = async () => {
  await deleteAllPosts();
  await deleteAllComments();
  //   await deleteAllUsers();
};

describe('Comments route tests', () => {
  //   let posts: any;
  let users: any;
  let comments: any;
  let db: any;
  let errorSpy: jest.SpyInstance; // This disables console error

  // Set up database
  beforeAll(async () => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      db = await initializeMongoServer();
      users = await createFakeUsers(TEST_CONSTANTS.DEFAULT_USERS_PROPS);
      //   posts = await createFakePosts(TEST_CONSTANTS.DEFAULT_POSTS_PROPS);
    } catch (error) {
      console.error(error);
    }
  });

  // Stop server
  afterAll(async () => {
    await db.stop();
    errorSpy.mockRestore();
  });

  describe('Querying comments', () => {
    beforeAll(async () => {
      comments = await createFakeComments(
        TEST_CONSTANTS.DEFAULT_COMMENTS_PROPS,
      );
    });

    afterAll(clearDB);

    test('returns status 404 if post with given id not found', (done) => {
      request(app)
        .get('/000')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Post not found' })
        .expect(404, done);
    });

    test('get all comments from post', (done) => {
      request(app)
        .get(`/${TEST_CONSTANTS.POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            comments: [comments.one, comments.two, comments.three],
          });
        })
        .expect(200, done);
    });
  });

  describe('Create comment', () => {
    beforeAll(async () => {
      await createFakePosts(TEST_CONSTANTS.DEFAULT_POSTS_PROPS);
    });
    afterAll(clearDB);

    test('returns status 400 on body not provided', (done) => {
      request(app)
        .post(`/${TEST_CONSTANTS.POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not all neccessery fields were provided' })
        .expect(400, done);
    });

    test('returns status 404 if post is not found', (done) => {
      const requestBody = { body: 'This is test comment' };
      request(app)
        .post('/000')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect({ error: 'Post not found' })
        .expect(404, done);
    });

    test('return comment on success', (done) => {
      const requestBody = { body: 'This is test comment' };
      request(app)
        .post(`/${TEST_CONSTANTS.POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: 'Comment successfully created',
            comment: {
              body: requestBody.body,
              author: TEST_CONSTANTS.USER_IDS.one.toString(),
              likes: [],
              post: TEST_CONSTANTS.POST_IDS.one.toString(),
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Update comment', () => {
    beforeAll(async () => {
      comments = await createFakeComments({
        commentOne: { author: TEST_CONSTANTS.USER_IDS.one },
        commentTwo: {},
        commentThree: {},
        commentIds: TEST_CONSTANTS.COMMENT_IDS,
        authorId: TEST_CONSTANTS.USER_IDS.one,
        postId: TEST_CONSTANTS.POST_IDS.one,
      });
    });

    afterAll(clearDB);

    test('returns status 404 if comment is not found', (done) => {
      const requestBody = { body: 'This is test' };
      request(app)
        .put(`/000`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect({ error: 'Comment not found' })
        .expect(404, done);
    });

    test("returns staus 401  if user is not comment's creator", (done) => {
      const requestBody = { body: 'This is test' };
      request(app)
        .put(`/${TEST_CONSTANTS.COMMENT_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect({ error: 'Unauthorized' })
        .expect(401, done);
    });

    test('returns modified comment on success', (done) => {
      const requestBody = { body: 'test' };
      request(app)
        .put(`/${TEST_CONSTANTS.COMMENT_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            comment: { body: requestBody.body },
            message: 'Comment edited successfully',
          });
        })
        .expect(200, done);
    });
  });

  describe('Delete comment', () => {
    beforeAll(async () => {
      comments = await createFakeComments(
        TEST_CONSTANTS.DEFAULT_COMMENTS_PROPS,
      );
    });
    afterAll(clearDB);

    test('returns status 404 if comment is not found', (done) => {
      request(app)
        .delete(`/000`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Comment not found' })
        .expect(404, done);
    });

    test("returns staus 401  if user is not comment's creator", (done) => {
      request(app)
        .delete(`/${TEST_CONSTANTS.COMMENT_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Unauthorized' })
        .expect(401, done);
    });

    test('returns message on success', (done) => {
      request(app)
        .delete(`/${TEST_CONSTANTS.COMMENT_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Comment deleted successfully' })
        .expect(200, done);
    });

    test("removes deleted comment's id from post that it was on", (done) => {
      request(app)
        .delete(`/${TEST_CONSTANTS.COMMENT_IDS.two}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Comment deleted successfully' })
        .expect(200, () => {
          Post.findById(comments.post._id)
            .then((docs) => {
              if (docs) {
                expect(docs.comments).not.toContainEqual(COMMENT_IDS.two);
                done();
              } else {
                throw new Error('Post not found');
              }
            })
            .catch((error) => {
              console.error(error);
              done(error);
            });
        });
    });
  });

  describe('Liking comments', () => {
    beforeAll(async () => {
      comments = await createFakeComments({
        commentOne: {},
        commentTwo: {},
        commentThree: { likes: [TEST_CONSTANTS.USER_IDS.one] },
        commentIds: TEST_CONSTANTS.COMMENT_IDS,
        authorId: TEST_CONSTANTS.USER_IDS.one,
        postId: TEST_CONSTANTS.POST_IDS.one,
      });
    });
    afterAll(clearDB);

    test('returns status 404 if comment is not found', (done) => {
      request(app)
        .post(`/000/likes`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Comment not found' })
        .expect(404, done);
    });

    test('returns status 400 if comment is already liked', (done) => {
      request(app)
        .post(`/${TEST_CONSTANTS.COMMENT_IDS.three}/likes`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Comment is already liked' })
        .expect(400, done);
    });

    test('returns message on success', (done) => {
      request(app)
        .post(`/${TEST_CONSTANTS.COMMENT_IDS.one}/likes`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Comment liked successfully' })
        .expect(200, done);
    });
  });

  describe('Disliking comments', () => {
    beforeAll(async () => {
      comments = await createFakeComments({
        commentOne: { likes: [TEST_CONSTANTS.USER_IDS.one] },
        commentTwo: {},
        commentThree: {},
        commentIds: TEST_CONSTANTS.COMMENT_IDS,
        authorId: TEST_CONSTANTS.USER_IDS.one,
        postId: TEST_CONSTANTS.POST_IDS.one,
      });
    });
    afterAll(clearDB);

    test('returns status 404 if comment is not found', (done) => {
      request(app)
        .delete(`/000/likes`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Comment not found' })
        .expect(404, done);
    });

    test('returns status 400 if comment is already liked', (done) => {
      request(app)
        .delete(`/${TEST_CONSTANTS.COMMENT_IDS.three}/likes`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: "Comment isn't liked" })
        .expect(400, done);
    });

    test('returns message on success', (done) => {
      request(app)
        .delete(`/${TEST_CONSTANTS.COMMENT_IDS.one}/likes`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Comment unliked successfully' })
        .expect(200, done);
    });
  });
});
