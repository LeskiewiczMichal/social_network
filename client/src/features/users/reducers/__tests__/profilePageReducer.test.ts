import { MOCKS } from '../../../../utils/test_utils';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  store,
} from '../../../../utils/setupTest';
import { setShowFriends, setUser } from '../profilePageReducer';

describe('Profile page reducer', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
  });

  test('Set show friends works', () => {
    store.dispatch(setShowFriends(true));
    expect(store.getState().profilePage.showFriends).toBeTruthy();

    store.dispatch(setShowFriends(false));
    expect(store.getState().profilePage.showFriends).toBeFalsy();
  });

  test('Set user works', () => {
    store.dispatch(setUser(MOCKS.USER));
    expect(store.getState().user).toMatchObject({
      id: MOCKS.USER.id,
      firstName: MOCKS.USER.firstName,
      lastName: MOCKS.USER.lastName,
      email: MOCKS.USER.email,
      friends: MOCKS.USER.friends,
      country: MOCKS.USER.country,
      city: MOCKS.USER.city,
      postalCode: MOCKS.USER.postalCode,
      about: MOCKS.USER.about,
      birthday: MOCKS.USER.birthday,
      profilePicture: MOCKS.USER.profilePicture,
    });
  });
});
