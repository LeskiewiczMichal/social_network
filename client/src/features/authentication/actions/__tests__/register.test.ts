import { NavigateFunction } from 'react-router-dom';

import { setRegisterError } from '../../../../store/reducers/errorReducer';
import register from '../register';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  mock,
  dispatch,
  mockExtraArguments,
  store,
} from '../../../../utils/setupTest';

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
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
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
