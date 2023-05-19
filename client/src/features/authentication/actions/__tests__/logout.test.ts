import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

import logout from '../logout';
import { setUser } from '../../reducers/userReducer';
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

describe('Logout', () => {
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

  test('should dispatch user to reducer', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD');
    mock
      .onGet(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/token`)
      .reply(200, {
        user: { ...expectedUser, _id: '2115' },
      });

    const expectedAction = setUser({
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      friends: null,
      country: null,
      city: null,
      postalCode: null,
      about: null,
      friendRequests: null,
      birthday: null,
      profilePicture: null,
      googleId: null,
    });

    const logoutThunk = logout();

    await logoutThunk(dispatch, store.getState, mockExtraArguments);

    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
