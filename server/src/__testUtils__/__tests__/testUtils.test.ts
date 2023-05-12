import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { serverConfig } from '../../middleware';
import { Comment, Post, User } from '../../models';
import * as TestUtils from '..';
import createFakeComments from '../createFakeComments';

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

  describe('Delete all users', () => {
    beforeEach(async () => {
      const userOne = new User({
        firstName: 'test',
        lastName: 'test',
        email: 'test@mail.com',
        friends: [],
        friendRequests: [],
        birthday: new Date('2000-03-09'),
        country: 'Poland',
        city: 'Sieradz',
        postalCode: '98-200',
        about: 'test',
        profilePicture: '/test/test.png',
      });

      const userTwo = new User({
        firstName: 'qwer',
        lastName: 'qwer',
        email: 'qwer@mail.com',
        friends: [],
        friendRequests: [],
        birthday: new Date('2000-03-09'),
        country: 'Poland',
        city: 'Sieradz',
        postalCode: '98-200',
        about: 'test',
        profilePicture: '/test/test.png',
      });

      await userOne.save();
      await userTwo.save();
    });

    test('deletes users from database', () => {
      TestUtils.deleteAllUsers();

      User.find()
        .then((docs) => {
          expect(docs).toHaveLength(0);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });

  describe('Delete all posts', () => {
    beforeEach(async () => {
      const userOne = new User({
        _id: IDS.one,
        firstName: 'test',
        lastName: 'test',
        email: 'test@mail.com',
        friends: [],
        friendRequests: [],
        birthday: new Date('2000-03-09'),
        country: 'Poland',
        city: 'Sieradz',
        postalCode: '98-200',
        about: 'test',
        profilePicture: '/test/test.png',
      });
      await userOne.save();

      const postOne = new Post({
        title: 'testOne',
        body: 'testing body one',
        author: IDS.one,
        comments: [],
        likes: [],
      });

      const postTwo = new Post({
        title: 'testingTwo',
        body: 'testing two',
        author: IDS.one,
        comments: [],
        likes: [],
      });

      await postOne.save();
      await postTwo.save();
    });

    test('deletes posts from database', () => {
      TestUtils.deleteAllPosts();

      Post.find()
        .then((docs) => {
          expect(docs).toHaveLength(0);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });

  describe('Delete all comments', () => {
    beforeEach(async () => {
      const commentOne = new Comment({
        body: 'testing one',
        author: IDS.one,
        post: TestUtils.CONSTANTS.POST_IDS.one,
        likes: [],
      });

      const commentTwo = new Comment({
        body: 'testing two',
        author: IDS.one,
        post: TestUtils.CONSTANTS.POST_IDS.one,
        likes: [],
      });

      const commentThree = new Comment({
        body: 'testing three',
        author: IDS.one,
        post: TestUtils.CONSTANTS.POST_IDS.one,
        likes: [],
      });

      await commentOne.save();
      await commentTwo.save();
      await commentThree.save();
    });

    test('deletes comments from database', () => {
      TestUtils.deleteAllComments();

      Comment.find()
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
      const users = await TestUtils.createFakeUsers({
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
      const users = await TestUtils.createFakeUsers({
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

  describe('Create fake posts', () => {
    afterEach(async () => {
      try {
        await User.deleteMany({});
        await Post.deleteMany({});
      } catch (error) {
        console.error(error);
      }
    });

    test('returns proper basic post when empty props provided', async () => {
      const posts = await TestUtils.createFakePosts({
        postOne: {},
        postTwo: {},
        postThree: {},
        postIds: TestUtils.CONSTANTS.POST_IDS,
        authorId: TestUtils.CONSTANTS.USER_IDS.one,
      });

      expect(typeof posts.one._id).toBe('string');
      expect(typeof posts.two._id).toBe('string');
      expect(typeof posts.three._id).toBe('string');
      expect(posts).toMatchObject({
        one: {
          title: 'Testing',
          body: 'Testing post number one',
          author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
          comments: [],
          likes: [],
        },
        two: {
          title: 'TesterPost',
          body: 'Testing post number two',
          author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
          comments: [],
          likes: [],
        },
        three: {
          title: 'TesterPost',
          body: 'Testing post number three',
          author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
          comments: [],
          likes: [],
        },
      });
    });

    test('returns proper custom posts', async () => {
      const posts = await TestUtils.createFakePosts({
        postOne: {
          title: 'test',
          body: 'test',
          author: TestUtils.CONSTANTS.USER_IDS.two,
          likes: [TestUtils.CONSTANTS.USER_IDS.three],
        },
        postTwo: {
          title: 'ok',
          body: 'ok',
        },
        postThree: {
          author: TestUtils.CONSTANTS.USER_IDS.three,
          likes: [
            TestUtils.CONSTANTS.USER_IDS.one,
            TestUtils.CONSTANTS.USER_IDS.three,
          ],
        },
        postIds: TestUtils.CONSTANTS.POST_IDS,
        authorId: TestUtils.CONSTANTS.USER_IDS.one,
      });

      expect(typeof posts.one._id).toBe('string');
      expect(typeof posts.two._id).toBe('string');
      expect(typeof posts.three._id).toBe('string');
      expect(posts).toMatchObject({
        one: {
          title: 'test',
          body: 'test',
          author: TestUtils.CONSTANTS.USER_IDS.two.toString(),
          likes: [TestUtils.CONSTANTS.USER_IDS.three],
        },
        two: {
          title: 'ok',
          body: 'ok',
        },
        three: {
          author: TestUtils.CONSTANTS.USER_IDS.three.toString(),
          likes: [
            TestUtils.CONSTANTS.USER_IDS.one,
            TestUtils.CONSTANTS.USER_IDS.three,
          ],
        },
      });
    });
  });

  describe('Create fake comments', () => {
    afterEach(async () => {
      try {
        await User.deleteMany({});
        await Comment.deleteMany({});
        await Post.deleteMany({});
      } catch (error) {
        console.error(error);
      }
    });

    test('returns proper basic comments when empty props provided', async () => {
      const comments = await createFakeComments({
        commentOne: {},
        commentTwo: {},
        commentThree: {},
        commentIds: TestUtils.CONSTANTS.COMMENT_IDS,
        postId: TestUtils.CONSTANTS.POST_IDS.one,
        authorId: TestUtils.CONSTANTS.USER_IDS.one,
      });

      expect(typeof comments.one._id).toBe('string');
      expect(typeof comments.two._id).toBe('string');
      expect(typeof comments.three._id).toBe('string');
      expect(comments).toMatchObject({
        one: {
          body: 'Testing comment number one',
          author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
          post: TestUtils.CONSTANTS.POST_IDS.one.toString(),
          likes: [],
        },
        two: {
          body: 'Testing comment number two',
          author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
          post: TestUtils.CONSTANTS.POST_IDS.one.toString(),
          likes: [],
        },
        three: {
          body: 'Testing comment number three',
          author: TestUtils.CONSTANTS.USER_IDS.one.toString(),
          post: TestUtils.CONSTANTS.POST_IDS.one.toString(),
          likes: [],
        },
      });
    });

    test('returns proper custom comments', async () => {
      const comments = await createFakeComments({
        commentOne: {
          body: 'test',
          post: TestUtils.CONSTANTS.POST_IDS.two,
          author: TestUtils.CONSTANTS.USER_IDS.two,
          likes: [TestUtils.CONSTANTS.USER_IDS.two],
        },
        commentTwo: {
          body: 'ok',
        },
        commentThree: {
          author: TestUtils.CONSTANTS.USER_IDS.three,
          post: TestUtils.CONSTANTS.POST_IDS.two,
          likes: [
            TestUtils.CONSTANTS.USER_IDS.one,
            TestUtils.CONSTANTS.USER_IDS.three,
          ],
        },
        commentIds: TestUtils.CONSTANTS.COMMENT_IDS,
        authorId: TestUtils.CONSTANTS.USER_IDS.one,
        postId: TestUtils.CONSTANTS.POST_IDS.one,
      });

      expect(typeof comments.one._id).toBe('string');
      expect(typeof comments.two._id).toBe('string');
      expect(typeof comments.three._id).toBe('string');
      expect(comments).toMatchObject({
        one: {
          body: 'test',
          post: TestUtils.CONSTANTS.POST_IDS.two.toString(),
          author: TestUtils.CONSTANTS.USER_IDS.two.toString(),
          likes: [TestUtils.CONSTANTS.USER_IDS.two],
        },
        two: {
          body: 'ok',
        },
        three: {
          author: TestUtils.CONSTANTS.USER_IDS.three.toString(),
          post: TestUtils.CONSTANTS.POST_IDS.two.toString(),
          likes: [
            TestUtils.CONSTANTS.USER_IDS.one,
            TestUtils.CONSTANTS.USER_IDS.three,
          ],
        },
      });
    });
  });
});
