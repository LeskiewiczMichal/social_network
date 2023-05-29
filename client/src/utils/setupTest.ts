/* eslint-disable import/no-mutable-exports */
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { UserState } from '../features/authentication/types/userState';
import { ProfilePageState } from '../features/users/types/profilePageState';
import { ErrorState } from '../types/error';
import { createTestStore, MOCKS } from './test_utils';
import { setUser as userReducerSetUser } from '../features/authentication/reducers/userReducer';
import { setUser as profilePageSetUser } from '../features/users/reducers/profilePageReducer';

// Mock redux
let store: ToolkitStore<
  {
    user: UserState;
    error: ErrorState;
    profilePage: ProfilePageState;
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
let dispatch: jest.Mock<any, any>; // Can check if dispatch was called with this one in thunk
let mockExtraArguments: {}; // Extra arguments needed for thunks
let mock: MockAdapter; // Axios mock

// Mock to disable console error
const consoleErrorSpy = jest.spyOn(console, 'error');
consoleErrorSpy.mockImplementation(() => {});
jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD'); // Mock localstorage to return something

const setupMocks = () => {
  TimeAgo.addLocale(en); // Add time locale for files that do not have it

  // Set up axios mock and disable console error
  mock = new MockAdapter(axios);
  // Set up redux mocks
  store = createTestStore();
  store.dispatch(profilePageSetUser({ ...MOCKS.USER, friendRequests: [] }));
  store.dispatch(userReducerSetUser({ ...MOCKS.USER, friendRequests: [] }));
  dispatch = jest.fn();
  mockExtraArguments = {};
};

const resetMocks = () => {
  mock.reset();
};

const restoreMocks = () => {
  mock.restore();
  consoleErrorSpy.mockRestore();
};

export {
  setupMocks,
  resetMocks,
  restoreMocks,
  store,
  dispatch,
  mockExtraArguments,
  mock,
};
