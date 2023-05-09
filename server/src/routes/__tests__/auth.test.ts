import * as dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { authRouter } from '..';
import { serverConfig } from '../../middleware';
import { User } from '../../models';
import { initializeMongoServer } from '../../__testUtils__';

// Config test server
dotenv.config();
const app = express();
serverConfig(app);
app.use('/', authRouter);

const userId = new mongoose.Types.ObjectId();
const mockUser = {
  _id: userId,
  email: 'test.user@example.com',
  firstName: 'Test',
  lastName: 'Surname',
  birthday: '1000-05-05T00:00:00.000Z',
  password: 'password123',
};

describe('Auth route tests', () => {
  let db: any;

  // Set up test database
  beforeAll(async () => {
    try {
      db = await initializeMongoServer();
      const user = new User(mockUser);
      await user.save();
    } catch (error) {
      console.error(error);
    }
  });

  // Stop server
  afterAll(async () => {
    await db.stop();
  });

  describe('Register user', () => {
    test('returns error on body not provided ', (done) => {
      request(app)
        .post('/')
        .expect('Content-Type', /json/)
        .expect({
          error: 'Missing required body field: email',
        })
        .expect(400, done);
    });

    test('successfull', (done) => {
      const requestBody = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        birthday: new Date('2000-01-01'),
        password: 'example123',
      };
      request(app)
        .post('/')
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            user: {
              email: 'john.doe@example.com',
              firstName: 'John',
              lastName: 'Doe',
              birthday: '2000-01-01T00:00:00.000Z',
              friends: [],
              friendRequests: [],
            },
          });
        })
        .expect(200, done);
    });
  });

  describe('Login', () => {
    test('returns error when wrong password provided', (done) => {
      const body = { email: 'test.user@example.com', password: 'password' };
      request(app)
        .post('/login')
        .send(body)
        .expect('Content-Type', /json/)
        .expect({ error: 'Incorrect email or password' })
        .expect(400, done);
    });

    test('returns token and user on success', (done) => {
      const body = { email: 'john.doe@example.com', password: 'example123' };
      request(app)
        .post('/login')
        .send(body)
        .expect('Content-Type', /json/)
        .expect((res) => {
          const { token, user } = res.body;
          expect(typeof token).toBe('string');
          expect(user).toMatchObject({
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            birthday: '2000-01-01T00:00:00.000Z',
            friends: [],
            friendRequests: [],
          });
        })
        .expect(200, done);
    });
  });

  describe('Token authentication', () => {
    const token = jwt.sign({ id: userId }, process.env.SECRET!);

    test('Returns user when proper token is provided', (done) => {
      request(app)
        .get('/token')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).toMatchObject({
            user: {
              email: 'test.user@example.com',
              firstName: 'Test',
              lastName: 'Surname',
              birthday: '1000-05-05T00:00:00.000Z',
              password: 'password123',
            },
          });
        })
        .expect(200, done);
    });
  });
});
