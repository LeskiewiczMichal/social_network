import { MOCKS } from '../../../../utils/test_utils';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  mock,
} from '../../../../utils/setupTest';
import getUser from '../getUser';

describe('Get user', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
  });

  test('Returns user object when API call is successfull', async () => {
    mock
      .onGet(`${process.env.REACT_APP_SERVER_URL}/api/users/${MOCKS.USER.id}`)
      .reply(200, {
        user: {
          ...MOCKS.USER,
          _id: MOCKS.USER.id,
        },
      });

    const user = await getUser({ userId: MOCKS.USER.id });

    expect(user).toMatchObject(MOCKS.USER);
  });

  test('Returns nothing when API call fails', async () => {
    mock
      .onGet(`${process.env.REACT_APP_SERVER_URL}/api/users/${MOCKS.USER.id}`)
      .reply(404);

    const user = await getUser({ userId: MOCKS.USER.id });

    expect(user).toBeNull();
  });
});
