import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

import logout from '../logout';
import { setUser } from '../../reducers/userReducer';
import { createTestStore, MOCKS } from '../../../../utils/test_utils';
import { ErrorState } from '../../../../types/error';
import { UserState } from '../../types/userState';

describe('Logout', () => {
  // Set up API and store mocks
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
    // Mock localstorage and API call
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD');
    mock
      .onGet(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/token`)
      .reply(200, {
        user: { ...MOCKS.USER, _id: '2115' },
      });

    // Expect to null the reducer
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
    });

    // Create and call function
    const logoutThunk = logout();
    await logoutThunk(dispatch, store.getState, mockExtraArguments);

    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
