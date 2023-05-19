import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

import login from '../login';
import { setUser } from '../../reducers/userReducer';
import { setLoginError } from '../../../../store/reducers/errorReducer';
import { createTestStore } from '../../../../utils/test_utils';
import { ErrorState } from '../../../../types/error';
import { UserState } from '../../types/userState';

const expectedUser = {
  firstName: 'test',
  lastName: 'test',
  email: 'test@mail.pl',
  friends: [],
  friendRequests: [],
  birthday: '2020-01-01',
  country: 'test',
  city: 'test',
  postalCode: 'test',
  about: 'test',
  profilePicture: 'test',
};

describe('Login thunk', () => {
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

  describe('When API call is successful', () => {
    test('should dispatch user to reducer', async () => {
      mock
        .onPost(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/login`)
        .reply(200, {
          user: { ...expectedUser, _id: '2115' },
        });

      const expectedAction = setUser({
        ...expectedUser,
        id: '2115',
      });

      const loginThunk = login({
        email: 'test@mail.pl',
        password: 'test',
      });

      await loginThunk(dispatch, store.getState, mockExtraArguments);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('When API call fails', () => {
    test('should dispatch error to reducer', async () => {
      mock
        .onPost(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/login`)
        .reply(404, {
          error: 'Invalid email or password',
        });

      const expectedAction = setLoginError('Invalid email or password');

      const loginThunk = login({
        email: 'test@mail.pl',
        password: 'test',
      });

      await loginThunk(dispatch, store.getState, mockExtraArguments);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
