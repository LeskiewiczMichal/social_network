import logout from '../logout';
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

describe('Logout', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
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
