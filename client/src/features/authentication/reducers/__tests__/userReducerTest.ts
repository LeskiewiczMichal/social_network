import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

import { setUser } from '../userReducer';
import { createTestStore } from '../../../../utils/test_utils';
import { ErrorState } from '../../../../types/error';
import { UserState } from '../../types/userState';

const expectedUser: UserState = {
  id: '2115',
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

describe('Auto Login thunk', () => {
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

  beforeEach(() => {
    mock = new MockAdapter(axios);
    store = createTestStore();
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('setUser action', async () => {
    await store.dispatch(setUser(expectedUser));

    const state = store.getState();
    expect(state).toMatchObject({
      user: expectedUser,
      error: { loginError: null },
    });
  });
});
