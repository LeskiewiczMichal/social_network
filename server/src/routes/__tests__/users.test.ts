import * as dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import { usersRouter } from '..';
import { serverConfig } from '../../middleware';
import { User } from '../../models';
import * as TestUtils from '../../__testUtils__';

// Config test server
dotenv.config();
const app = express();
serverConfig(app);
app.use('/', usersRouter);

describe('Users route tests', () => {
  let users: any;
  let db: any;
  let errorSpy: jest.SpyInstance; // This disables console error

  // Set up database
  beforeAll(async () => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      db = await TestUtils.initializeMongoServer();
    } catch (error) {
      console.error(error);
    }
  });

  // Stop server
  afterAll(async () => {
    await db.stop();
    errorSpy.mockRestore();
  });

  describe('Querying users', () => {
    beforeAll(async () => {
      users = await TestUtils.createFakeUsers(
        TestUtils.CONSTANTS.DEFAULT_USERS_PROPS,
      );
    });

    afterAll(TestUtils.deleteAllUsers);

    test('Get all users', (done) => {
      request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            users: [users.one, users.two, users.three],
          });
        })
        .expect(200, done);
    });

    test('Get single user by id', (done) => {
      request(app)
        .get(`/${TestUtils.CONSTANTS.USER_IDS.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            user: users.one,
          });
        })
        .expect(200, done);
    });

    test("returns status 404 if user with given id doesn't exist", (done) => {
      request(app)
        .get('/000')
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });
  });

  describe('Update user data', () => {
    beforeAll(async () => {
      try {
        users = await TestUtils.createFakeUsers(
          TestUtils.CONSTANTS.DEFAULT_USERS_PROPS,
        );
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(TestUtils.deleteAllUsers);

    test('should update user data when verified', (done) => {
      const requestBody = {
        email: 'john@example.com',
        firstName: 'test',
        lastName: 'test',
        birthday: new Date('2000-01-01'),
      };
      request(app)
        .put('/')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            user: {
              firstName: 'test',
              lastName: 'test',
              email: 'john@example.com',
              birthday: '2000-01-01T00:00:00.000Z',
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Delete user', () => {
    beforeAll(async () => {
      try {
        users = await TestUtils.createFakeUsers(
          TestUtils.CONSTANTS.DEFAULT_USERS_PROPS,
        );
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(TestUtils.deleteAllUsers);

    test('should delete user when verified', (done) => {
      request(app)
        .delete('/')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'User deleted succesfully' })
        .expect(200, () => {
          User.findById(users.one._id)
            .then((docs) => {
              expect(docs).toBeNull();
              done();
            })
            .catch((err) => {
              console.error(err);
              done(err);
            });
        });
    });
  });

  describe('Get friends', () => {
    beforeAll(async () => {
      try {
        users = await TestUtils.createFakeUsers({
          userOne: {
            friends: [
              TestUtils.CONSTANTS.USER_IDS.two,
              TestUtils.CONSTANTS.USER_IDS.three,
            ],
          },
          userTwo: {},
          userThree: {},
          ids: TestUtils.CONSTANTS.USER_IDS,
        });
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(TestUtils.deleteAllUsers);

    test('return empty array when user has no friends', (done) => {
      request(app)
        .get(`/${users.three._id}/friends`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            users: [],
          });
        })
        .expect(200, done);
    });

    test("get all user's friends", (done) => {
      request(app)
        .get(`/${users.one._id}/friends`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            users: [users.two, users.three],
          });
        })
        .expect(200, done);
    });
  });

  describe('Add friend', () => {
    beforeAll(async () => {
      try {
        users = await TestUtils.createFakeUsers({
          userOne: {
            friendRequests: [TestUtils.CONSTANTS.USER_IDS.two],
          },
          userTwo: {},
          userThree: {},
          ids: TestUtils.CONSTANTS.USER_IDS,
        });
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(TestUtils.deleteAllUsers);

    test("returns 404 if the user doesn't exist", (done) => {
      request(app)
        .post(`/friends/000`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test("returns 400 if the user isn't on friendRequests list", (done) => {
      request(app)
        .post(`/friends/${users.one._id}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: "User was not on friend's requests list" })
        .expect(400, done);
    });

    test('success', (done) => {
      request(app)
        .post(`/friends/${users.two._id}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: 'Friend added successfully',
          });
        })
        .expect(200, done);
    });
  });

  describe('Delete friend', () => {
    beforeAll(async () => {
      try {
        users = await TestUtils.createFakeUsers({
          userOne: {
            friends: [TestUtils.CONSTANTS.USER_IDS.two],
          },
          userTwo: {},
          userThree: {},
          ids: TestUtils.CONSTANTS.USER_IDS,
        });
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(TestUtils.deleteAllUsers);

    test("delete friend returns 404 if the user doesn't exist", (done) => {
      request(app)
        .delete('/friends/000')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test('delete friend returns 400 if users were not friends', (done) => {
      request(app)
        .delete(`/friends/${users.one._id}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: "User's were not friends" })
        .expect(400, done);
    });

    test('delete friend from user', (done) => {
      request(app)
        .delete(`/friends/${users.two._id}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: 'Friend deleted successfully',
            user: {
              friends: [],
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Send friend requests', () => {
    beforeAll(async () => {
      try {
        users = await TestUtils.createFakeUsers({
          userOne: {},
          userTwo: { friendRequests: [TestUtils.CONSTANTS.USER_IDS.one] },
          userThree: {},
          ids: TestUtils.CONSTANTS.USER_IDS,
        });
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(TestUtils.deleteAllUsers);

    test('returns status 404 on wrong userId provided', (done) => {
      request(app)
        .post('/friendRequests/000')
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test('returns 400 if friend request was already sent', (done) => {
      request(app)
        .post(`/friendRequests/${users.two._id}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Friend request was already sent' })
        .expect(400, done);
    });

    test('return message on success', (done) => {
      request(app)
        .post(`/friendRequests/${users.three._id}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'Friend request was sent successfully' })
        .expect(200, done);
    });
  });

  describe('Delete friend request', () => {
    beforeAll(async () => {
      try {
        users = await TestUtils.createFakeUsers({
          userOne: { friendRequests: [TestUtils.CONSTANTS.USER_IDS.two] },
          userTwo: {},
          userThree: {},
          ids: TestUtils.CONSTANTS.USER_IDS,
        });
      } catch (error) {
        console.error(error);
      }
    });

    afterAll(TestUtils.deleteAllUsers);

    test('returns 404 if wrong userId provided', (done) => {
      request(app)
        .delete(`/friendRequests/000`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test('returns 404 if friend request not found', (done) => {
      request(app)
        .delete(`/friendRequests/${users.three._id}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Not found' })
        .expect(404, done);
    });

    test('returns message and friend requests on success', (done) => {
      request(app)
        .delete(`/friendRequests/${users.two._id}`)
        .set('Authorization', `Bearer ${users.tokens.one}`)
        .expect('Content-Type', /json/)
        .expect((req) => {
          expect(req.body).toMatchObject({
            message: 'Friend request deleted',
            user: { friendRequests: [] },
          });
        })
        .expect(200, done);
    });
  });
});
