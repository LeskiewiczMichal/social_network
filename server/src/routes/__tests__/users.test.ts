import * as dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { usersRouter } from '..';
import { serverConfig } from '../../middleware';
import initializeMongoServer from './mongoConfigTesting';
import { User } from '../../models';

dotenv.config();
const app = express();
serverConfig(app);
app.use('/', usersRouter);

const userIdOne = new mongoose.Types.ObjectId();
const userIdTwo = new mongoose.Types.ObjectId();
const userIdThree = new mongoose.Types.ObjectId();
const usersExample = [
  {
    _id: userIdOne,
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123',
    email: 'john.doe@example.com',
    friends: [`${userIdTwo}`, `${userIdThree}`],
    friendRequests: [],
    birthday: new Date('1990-01-01'),
  },
  {
    _id: userIdTwo,
    firstName: 'Jane',
    lastName: 'Doe',
    password: 'password456',
    email: 'jane.doe@example.com',
    friends: [],
    friendRequests: [`${userIdOne}`, `${userIdThree}`],
    birthday: new Date('1995-05-04'),
    googleId: '5234553455',
  },
  {
    _id: userIdThree,
    firstName: 'Marry',
    lastName: 'Christmas',
    password: 'password90',
    email: 'marry.christmas@example.com',
    friends: [],
    friendRequests: [],
    birthday: new Date('2000-03-09'),
  },
];
const EXPECTED_USERS = [
  {
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123',
    email: 'john.doe@example.com',
    friends: [`${userIdTwo}`, `${userIdThree}`],
    friendRequests: [],
    birthday: '1990-01-01T00:00:00.000Z',
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    password: 'password456',
    email: 'jane.doe@example.com',
    friends: [],
    friendRequests: [`${userIdOne}`, `${userIdThree}`],
    birthday: '1995-05-04T00:00:00.000Z',
    googleId: '5234553455',
  },
  {
    firstName: 'Marry',
    lastName: 'Christmas',
    password: 'password90',
    email: 'marry.christmas@example.com',
    friends: [],
    friendRequests: [],
    birthday: '2000-03-09T00:00:00.000Z',
  },
];

describe('Users route tests', () => {
  let db: any;
  let token: string;

  // Set up database
  beforeAll(async () => {
    try {
      db = await initializeMongoServer();
    } catch (error) {
      console.error(error);
    }
  });

  // Stop server
  afterAll(async () => {
    await db.stop();
  });

  // Insert mock users to database
  beforeEach(async () => {
    try {
      await User.insertMany(usersExample);
      token = jwt.sign({ id: userIdOne }, process.env.SECRET!, {
        expiresIn: '1h',
      });
    } catch (error) {
      console.error(error);
    }
  });

  // Delete all users
  afterEach(async () => {
    try {
      await User.deleteMany({});
    } catch (error) {
      console.error(error);
    }
  });

  describe('Querying users', () => {
    test('Get all users', (done) => {
      request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            users: EXPECTED_USERS,
          });
        })
        .expect(200, done);
    });

    test('Get single user by id', (done) => {
      request(app)
        .get(`/${userIdOne}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            user: EXPECTED_USERS[0],
          });
        })
        .expect(200, done);
    });
  });

  describe('Update user data', () => {
    test('should update user data when verified', (done) => {
      const requestBody = {
        email: 'john@example.com',
        firstName: 'test',
        lastName: 'test',
        birthday: new Date('2000-01-01'),
      };
      request(app)
        .put('/')
        .set('Authorization', `Bearer ${token}`)
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
    test('should delete user when verified', (done) => {
      request(app)
        .delete('/')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'User deleted succesfully' })
        .expect(200, () => {
          User.findById(userIdOne)
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

  describe('Friends', () => {
    test('return empty array when user has no friends', (done) => {
      request(app)
        .get(`/${userIdThree}/friends`)
        .set('Authorization', `Bearer ${token}`)
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
        .get(`/${userIdOne}/friends`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            users: [EXPECTED_USERS[1], EXPECTED_USERS[2]],
          });
        })
        .expect(200, done);
    });

    test("add friend returns 404 if the user doesn't exist", (done) => {
      request(app)
        .post(`/${userIdThree}/friends/000`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'User not found' })
        .expect(404, done);
    });

    test('add friend to user', (done) => {
      request(app)
        .post(`/${userIdThree}/friends/${userIdOne}`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: 'Friend added successfully',
            user: {
              friends: [`${userIdOne}`],
            },
          });
        })
        .expect(200, done);
    });
  });
});
