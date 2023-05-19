import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

import { DbQueries } from '../../../../types';
import getPosts from '../getPosts';
import { setLoginError } from '../../../../store/reducers/errorReducer';
import { createTestStore } from '../../../../utils/test_utils';
import { ErrorState } from '../../../../types/error';

describe('Get posts', () => {
  let mock: MockAdapter;
  let store: ToolkitStore<
    {
      user: UserState;
      error: ErrorState;
    },
    AnyAction,
    [
      ThunkMiddleware<
        {
          user: UserState;
          error: ErrorState;
        },
        AnyAction
      >,
    ]
  >;
  let dispatch: jest.Mock<any, any>;
  let mockExtraArguments: {};

  beforeEach(() => {
    mock = new MockAdapter(axios);
    store = createTestStore();
    dispatch = jest.fn();
    mockExtraArguments = {};
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  describe('When API call is successfull', () => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD');
    });

    test('Should return posts', async () => {
      const limit = 5;
      const offset = 0;
      const mockPost = {
        _id: 'test',
        title: 'test',
        body: 'test',
        author: 'test',
        comments: [],
        likes: [],
        photo: null,
        createdAt: '2002-01-01',
        updatedAt: '1234-13-12',
      };
      mock
        .onGet(
          `${process.env.REACT_APP_SERVER_URL}/api/posts?sortOrder=asc&limit=${limit}&offset=${offset}}`,
        )
        .reply(200, {
          posts: [mockPost, mockPost],
        });

      const posts = await getPosts({
        sortOrder: DbQueries.SortOrder.ASCENDING,
        limit,
        offset,
      });

      const expectedPost = {
        id: 'test',
        title: 'test',
        body: 'test',
        author: {
          id: undefined,
          firstName: undefined,
          lastName: undefined,
          email: undefined,
          friends: undefined,
          friendRequests: undefined,
          birthday: undefined,
          country: undefined,
          city: undefined,
          postalCode: undefined,
          about: undefined,
          profilePicture: undefined,
        },
        comments: [],
        likes: [],
        photo: null,
        createdAt: '2002-01-01',
        updatedAt: '1234-13-12',
      };

      expect(posts).toMatchObject([expectedPost, expectedPost]);
    });
  });

  describe('When API call fails', () => {
    test('Should return empty array', async () => {
      const limit = 5;
      const offset = 0;
      mock
        .onGet(
          `${process.env.REACT_APP_SERVER_URL}/api/posts?sortOrder=asc&limit=${limit}&offset=${offset}}`,
        )
        .reply(404, {
          error: 'error',
        });

      const posts = await getPosts({
        sortOrder: DbQueries.SortOrder.ASCENDING,
        limit,
        offset,
      });

      expect(posts).toMatchObject([]);
    });
  });
});
