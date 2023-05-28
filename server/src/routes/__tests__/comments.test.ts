import * as dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import { commentsRouter } from '..';
import { serverConfig } from '../../middleware';
import { Post } from '../../models';
import * as TestUtils from '../../__testUtils__';

// Config test server
dotenv.config();
const app = express();
serverConfig(app);
app.use('/', commentsRouter);

const clearDB = async () => {
  await TestUtils.deleteAllPosts();
  await TestUtils.deleteAllComments();
};

describe('Comments route tests', () => {
  let users: any;
  let comments: any;
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

  describe('Querying comments', () => {
    beforeAll(async () => {
      comments = await TestUtils.createFakeComments(
        TestUtils.CONSTANTS.DEFAULT_COMMENTS_PROPS,
      );
    });

    afterAll(clearDB);

    test('returns status 404 if post with given id not found', (done) => {
      request(app)
        .get('/000')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test('get all comments from post', (done) => {
      request(app)
        .get(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            comments: [
              { ...comments.one, author: users.one },
              { ...comments.two, author: users.one },
              { ...comments.three, author: users.one },
            ],
          });
        })
        .expect(200, done);
    });
  });

  describe('Create comment', () => {
    beforeAll(async () => {
      await TestUtils.createFakePosts(TestUtils.CONSTANTS.DEFAULT_POSTS_PROPS);
    });
    afterAll(clearDB);

    test('returns status 400 on body not provided', (done) => {
      request(app)
        .post(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Missing required body field: body' })
        .expect(400, done);
    });

    test('returns status 404 if post is not found', (done) => {
      const requestBody = { body: 'This is test comment' };
      request(app)
        .post('/000')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test('return comment on success', (done) => {
      const requestBody = { body: 'This is test comment' };
      request(app)
        .post(`/${TestUtils.CONSTANTS.POST_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: 'Comment successfully created',
            comment: {
              body: requestBody.body,
              author: users.one,
              likes: [],
              post: TestUtils.CONSTANTS.POST_IDS.one.toString(),
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Update comment', () => {
    beforeAll(async () => {
      comments = await TestUtils.createFakeComments({
        commentOne: { author: TestUtils.CONSTANTS.USER_IDS.one },
        commentTwo: {},
        commentThree: {},
        commentIds: TestUtils.CONSTANTS.COMMENT_IDS,
        authorId: TestUtils.CONSTANTS.USER_IDS.one,
        postId: TestUtils.CONSTANTS.POST_IDS.one,
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
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test("returns staus 401  if user is not comment's creator", (done) => {
      const requestBody = { body: 'This is test' };
      request(app)
        .put(`/${TestUtils.CONSTANTS.COMMENT_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect({ error: 'Unauthorized' })
        .expect(401, done);
    });

    test('returns modified comment on success', (done) => {
      const requestBody = { body: 'test' };
      request(app)
        .put(`/${TestUtils.CONSTANTS.COMMENT_IDS.one}`)
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

    test('liking comments functionality', (done) => {
      request(app)
        .put(`/${TestUtils.CONSTANTS.COMMENT_IDS.one}?like=${users.two._id}`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            comment: { likes: [users.two._id] },
            message: 'Comment edited successfully',
          });
        })
        .expect(200, done);
    });

    test('disliking comments functionality', (done) => {
      request(app)
        .put(`/${TestUtils.CONSTANTS.COMMENT_IDS.one}?like=${users.two._id}`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            comment: { likes: [] },
            message: 'Comment edited successfully',
          });
        })
        .expect(200, done);
    });
  });

  describe('Delete comment', () => {
    beforeAll(async () => {
      comments = await TestUtils.createFakeComments(
        TestUtils.CONSTANTS.DEFAULT_COMMENTS_PROPS,
      );
    });
    afterAll(clearDB);

    test('returns status 404 if comment is not found', (done) => {
      request(app)
        .delete(`/000`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test("returns staus 401  if user is not comment's creator", (done) => {
      request(app)
        .delete(`/${TestUtils.CONSTANTS.COMMENT_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.two}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Unauthorized' })
        .expect(401, done);
    });

    test('returns message on success', (done) => {
      request(app)
        .delete(`/${TestUtils.CONSTANTS.COMMENT_IDS.one}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Comment deleted successfully' })
        .expect(200, done);
    });

    test("removes deleted comment's id from post that it was on", (done) => {
      request(app)
        .delete(`/${TestUtils.CONSTANTS.COMMENT_IDS.two}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Comment deleted successfully' })
        .expect(200, () => {
          Post.findById(comments.post._id)
            .then((docs) => {
              if (docs) {
                expect(docs.comments).not.toContainEqual(
                  TestUtils.CONSTANTS.COMMENT_IDS.two,
                );
                done();
              } else {
                throw new Error('Not found');
              }
            })
            .catch((error) => {
              console.error(error);
              done(error);
            });
        });
    });
  });
});
