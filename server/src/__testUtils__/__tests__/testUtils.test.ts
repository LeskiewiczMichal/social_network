import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { serverConfig } from '../../middleware';
import { User } from '../../models';
import { createFakeUsers, initializeMongoServer, deleteAllUsers } from '..';

dotenv.config();
const app = express();
serverConfig(app);

const IDS = {
  one: new mongoose.Types.ObjectId(),
  two: new mongoose.Types.ObjectId(),
  three: new mongoose.Types.ObjectId(),
};

describe('Utility functions', () => {
  let db: any;
  let errorSpy: jest.SpyInstance; // This disables console error

  // Set up database
  beforeAll(async () => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      db = await initializeMongoServer();
    } catch (error) {
      console.error(error);
    }
  });

  // Stop server
  afterAll(async () => {
    await db.stop();
    errorSpy.mockRestore();
  });

  describe('Delete all users', () => {
    beforeEach(async () => {
      const userOne = new User({
        firstName: 'test',
        lastName: 'test',
        email: 'test@mail.com',
        friends: [],
        friendRequests: [],
        birthday: new Date('2000-03-09'),
      });

      const userTwo = new User({
        firstName: 'qwer',
        lastName: 'qwer',
        email: 'qwer@mail.com',
        friends: [],
        friendRequests: [],
        birthday: new Date('2000-03-09'),
      });

      await userOne.save();
      await userTwo.save();
    });

    test('Delets users from database', () => {
      deleteAllUsers();

      User.find()
        .then((docs) => {
          expect(docs).toHaveLength(0);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });

  describe('Create fake users', () => {
    afterEach(async () => {
      try {
        await User.deleteMany({});
      } catch (error) {
        console.error(error);
      }
    });

    test('returns proper basic users when empty props provided', async () => {
      const users = await createFakeUsers({
        userOne: {},
        userTwo: {},
        userThree: {},
        ids: IDS,
      });

      expect(typeof users.tokens.one).toBe('string');
      expect(typeof users.tokens.two).toBe('string');
      expect(typeof users.tokens.three).toBe('string');
      expect(typeof users.one._id).toBe('string');
      expect(typeof users.two._id).toBe('string');
      expect(typeof users.three._id).toBe('string');
      expect(users).toMatchObject({
        one: {
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
          email: 'john.doe@example.com',
          friends: [],
          friendRequests: [],
          birthday: '1990-01-01T00:00:00.000Z',
        },
        two: {
          firstName: 'Jane',
          lastName: 'Doe',
          password: 'password456',
          email: 'jane.doe@example.com',
          friends: [],
          friendRequests: [],
          birthday: '1995-05-04T00:00:00.000Z',
          googleId: '5234553455',
        },
        three: {
          firstName: 'Marry',
          lastName: 'Christmas',
          password: 'password90',
          email: 'marry.christmas@example.com',
          friends: [],
          friendRequests: [],
          birthday: '2000-03-09T00:00:00.000Z',
        },
      });
    });

    test('returns proper custom users', async () => {
      const users = await createFakeUsers({
        userOne: {
          firstName: 'test',
          lastName: 'test',
          password: 'test',
          email: 'test',
          friends: [IDS.two],
          friendRequests: [IDS.three],
          googleId: '123',
        },
        userTwo: {
          firstName: 'ok',
          email: 'ok',
        },
        userThree: {
          friends: [IDS.three],
          friendRequests: [IDS.one],
        },
        ids: IDS,
      });

      expect(typeof users.tokens.one).toBe('string');
      expect(typeof users.tokens.two).toBe('string');
      expect(typeof users.tokens.three).toBe('string');
      expect(typeof users.one._id).toBe('string');
      expect(typeof users.two._id).toBe('string');
      expect(typeof users.three._id).toBe('string');
      expect(users).toMatchObject({
        one: {
          firstName: 'test',
          lastName: 'test',
          password: 'test',
          email: 'test',
          friends: [IDS.two],
          friendRequests: [IDS.three],
          birthday: '1990-01-01T00:00:00.000Z',
          googleId: '123',
        },
        two: {
          firstName: 'ok',
          lastName: 'Doe',
          password: 'password456',
          email: 'ok',
          friends: [],
          friendRequests: [],
          birthday: '1995-05-04T00:00:00.000Z',
          googleId: '5234553455',
        },
        three: {
          firstName: 'Marry',
          lastName: 'Christmas',
          password: 'password90',
          email: 'marry.christmas@example.com',
          friends: [IDS.three],
          friendRequests: [IDS.one],
          birthday: '2000-03-09T00:00:00.000Z',
        },
      });
    });
  });
});
