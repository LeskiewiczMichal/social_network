import login from '../login';
import { setUser } from '../../reducers/userReducer';
import { setLoginError } from '../../../../store/reducers/errorReducer';
import { MOCKS } from '../../../../utils/test_utils';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  mock,
  dispatch,
  mockExtraArguments,
  store,
} from '../../../../utils/setupTest';

describe('Login thunk', () => {
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
    test('should dispatch user to reducer', async () => {
      // Mock API call
      mock
        .onPost(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/login`)
        .reply(200, {
          user: { ...MOCKS.USER, friendRequests: [], _id: '2115' },
        });

      // Set expected action
      const expectedAction = setUser({
        ...MOCKS.USER,
        id: '2115',
        friendRequests: [],
      });

      // Create and call function
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
      // Mock API call
      mock
        .onPost(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/login`)
        .reply(404, {
          error: 'Invalid email or password',
        });

      const expectedError = setLoginError('Invalid email or password');

      // Create and call function
      const loginThunk = login({
        email: 'test@mail.pl',
        password: 'test',
      });
      await loginThunk(dispatch, store.getState, mockExtraArguments);

      expect(dispatch).toHaveBeenCalledWith(expectedError);
    });
  });
});
