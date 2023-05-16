import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { NavigateFunction } from 'react-router-dom';
import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

import { setUser } from '../../../../store/reducers/userReducer';
import {
  setLoginError,
  setRegisterError,
} from '../../../../store/reducers/errorReducer';
import { createTestStore } from '../../../../utils/test_utils';
import { UserState } from '../../../../types/user';
import { ErrorState } from '../../../../types/error';
import { AppThunk } from '../../../../types';
import register from '../register';

const formData = {
  firstName: 'test',
  lastName: 'test',
  password: 'test',
  email: 'test@mail.pl',
  birthday: '2020-01-01',
  country: 'test',
  city: 'test',
  postalCode: 'test',
  about: 'test',
  profilePicture: null,
};

describe('Register thunk', () => {
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
  let mock: MockAdapter;
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
    test('navigates to login page', async () => {
      const navigate: NavigateFunction = jest.fn();
      mock
        .onPost(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/`)
        .reply(200, {
          user: {
            firstName: 'test',
            lastName: 'test',
            password: 'test',
            email: 'test@mail.pl',
            birthday: '2020-01-01',
            country: 'test',
            city: 'test',
            postalCode: 'test',
            about: 'test',
            profilePicture: 'test',
            _id: '2115',
          },
          message: 'Account created successfully',
        });

      const registerThunk = register({ ...formData, navigate });
      await registerThunk(dispatch, store.getState(), mockExtraArguments);
      expect(navigate).toHaveBeenCalledWith('/');
    });
  });

  describe('When API call fails', () => {
    test('dispatches error to reducer', async () => {
      const navigate: NavigateFunction = jest.fn();
      mock
        .onPost(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/`)
        .reply(400, {
          error: 'Bad error',
        });

      const expectedAction = setRegisterError('Bad error');

      const registerThunk = register({ ...formData, navigate });
      await registerThunk(dispatch, store.getState(), mockExtraArguments);
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
