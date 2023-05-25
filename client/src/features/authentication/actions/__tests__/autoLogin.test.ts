import autoLogin from '../autoLogin';
import { setUser } from '../../reducers/userReducer';
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

describe('Auto Login thunk', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
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
