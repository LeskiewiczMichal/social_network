/* eslint-disable import/first */
import * as dotenv from 'dotenv';

dotenv.config();
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import verifyToken from '../verifyToken';
import serverConfig from '../serverConfig';
import { User, UserInterface } from '../../models';
import { initializeMongoServer } from '../../__testUtils__';

/// CONFIG ///
const app = express();
serverConfig(app);
app.use('/', verifyToken, (req: Request, res: Response) => {
  const user = req.user as UserInterface;

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json({ user });
});

const userId = new mongoose.Types.ObjectId();
const token = jwt.sign({ id: userId }, process.env.SECRET!, {
  expiresIn: '1h',
});
const mockUser = {
  _id: userId,
  email: 'test.user@example.com',
  firstName: 'Test',
  lastName: 'Surname',
  birthday: '1000-05-05T00:00:00.000Z',
  password: 'password123',
};

/// TESTS ///
describe('Auth route tests', () => {
  let db: any;

  beforeAll(async () => {
    try {
      db = await initializeMongoServer();
      const user = new User(mockUser);
      await user.save();
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    await db.stop();
  });

  test('returns 401 when token not provided', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect({ error: 'Unauthorized' })
      .expect(401, done);
  });

  test('Returns 401 when wrong token provided', (done) => {
    request(app)
      .get('/')
      .set('Authorization', `Bearer WRONG${token}`)
      .expect('Content-Type', /json/)
      .expect({ error: 'Unauthorized' })
      .expect(401, done);
  });

  test('Returns user when proper token is provided', (done) => {
    request(app)
      .get('/')
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
