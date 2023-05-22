import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { MOCKS } from '../../../../utils/test_utils';
import getUser from '../getUser';

describe('Get user', () => {
  let mock: MockAdapter;
  const consoleErrorSpy = jest.spyOn(console, 'error');

  beforeAll(() => {
    consoleErrorSpy.mockImplementation(() => {});
  });

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    consoleErrorSpy.mockRestore();
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
