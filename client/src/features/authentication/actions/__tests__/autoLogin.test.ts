import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

import autoLogin from '../autoLogin';
import { setUser } from '../../reducers/userReducer';
import { createTestStore, MOCKS } from '../../../../utils/test_utils';
import { ErrorState } from '../../../../types/error';
import { UserState } from '../../types/userState';

describe('Auto Login thunk', () => {
  // Set up API and redux mocks
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

  describe('When Token is provided', () => {
    test('should dispatch user to reducer', async () => {
      // Mock localstorage and API call
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD');
      mock
        .onGet(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/token`)
        .reply(200, {
          user: { ...MOCKS.USER, friendRequests: [], _id: '2115' },
        });

      const expectedAction = setUser({
        ...MOCKS.USER,
        id: '2115',
        friendRequests: [],
      });

      // Create and call function
      const autoLoginThunk = autoLogin();
      await autoLoginThunk(dispatch, store.getState, mockExtraArguments);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('When Token is not provided', () => {
    test("shouldn't call dispatch", async () => {
      // Mock API call
      mock
        .onGet(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/token`)
        .reply(200, {
          user: { ...MOCKS.USER, _id: '2115' },
        });

      // Create and call function
      const autoLoginThunk = autoLogin();
      await autoLoginThunk(dispatch, store.getState, mockExtraArguments);

      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
