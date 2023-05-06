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

const userId = new mongoose.Types.ObjectId();
const usersExample = [
  {
    _id: userId,
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123',
    email: 'john.doe@example.com',
    friends: [],
    friendRequests: [],
    birthday: new Date('1990-01-01'),
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    password: 'password456',
    email: 'jane.doe@example.com',
    friends: [],
    friendRequests: [],
    birthday: new Date('1995-05-04'),
    googleId: '5234553455',
  },
  {
    firstName: 'Marry',
    lastName: 'Christmas',
    password: 'password90',
    email: 'marry.christmas@example.com',
    friends: [],
    friendRequests: [],
    birthday: new Date('2000-03-09'),
  },
];

describe('Users route tests', () => {
  let db: any;
  let token: string;

  beforeAll(async () => {
    try {
      db = await initializeMongoServer();
      await User.insertMany(usersExample);
      token = jwt.sign({ id: userId }, process.env.SECRET!, {
        expiresIn: '1h',
      });
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    await db.stop();
  });

  describe('Querying users', () => {
    test('Get all users', (done) => {
      request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            users: [
              {
                firstName: 'John',
                lastName: 'Doe',
                password: 'password123',
                email: 'john.doe@example.com',
                friends: [],
                friendRequests: [],
                birthday: '1990-01-01T00:00:00.000Z',
              },
              {
                firstName: 'Jane',
                lastName: 'Doe',
                password: 'password456',
                email: 'jane.doe@example.com',
                friends: [],
                friendRequests: [],
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
            ],
          });
        })
        .expect(200, done);
    });

    test('Get single user by id', (done) => {
      request(app)
        .get(`/${userId}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            user: {
              firstName: 'John',
              lastName: 'Doe',
              password: 'password123',
              email: 'john.doe@example.com',
              friends: [],
              friendRequests: [],
              birthday: '1990-01-01T00:00:00.000Z',
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Update user data', () => {
    test('should return status 401 when JWT not provided', (done) => {
      request(app).put('/').expect(401, done);
    });

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
              password: 'password123',
              email: 'john@example.com',
              friends: [],
              friendRequests: [],
              birthday: '2000-01-01T00:00:00.000Z',
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Delete user', () => {
    test('should return status 401 when JWT not provided', (done) => {
      request(app).delete('/').expect(401, done);
    });

    test('should delete user when verified', (done) => {
      request(app)
        .delete('/')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect({ message: 'User deleted succesfully' })
        .expect(200, () => {
          User.findById(userId)
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
});
