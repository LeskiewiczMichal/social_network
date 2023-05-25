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

  describe('When API call is successfull', () => {
    test('Returns user object', async () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD');
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
  });

  describe('When API call fails', () => {
    test('Returns nothing', async () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD');
      mock
        .onGet(`${process.env.REACT_APP_SERVER_URL}/api/users/${MOCKS.USER.id}`)
        .reply(404);

      const user = await getUser({ userId: MOCKS.USER.id });

      expect(user).toBeNull();
    });
  });
});
