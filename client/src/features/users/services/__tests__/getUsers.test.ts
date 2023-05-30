import { MOCKS } from '../../../../utils/test_utils';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  mock,
} from '../../../../utils/setupTest';
import getUsers from '../getUsers';

const apiUrl = new RegExp(`${process.env.REACT_APP_SERVER_URL}/api/users.*`);

describe('Get users', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
  });

  test('Returns all users list when API call is successfull', async () => {
    mock
      .onGet(apiUrl)
      .reply(200, { users: [{ ...MOCKS.USER, _id: MOCKS.USER.id }] });

    const users = await getUsers({});
    expect(users).toMatchObject([MOCKS.USER]);
  });

  test('Calls axios get with proper params', async () => {
    mock
      .onGet(apiUrl)
      .reply(200, { users: [{ ...MOCKS.USER, _id: MOCKS.USER.id }] });

    const users = await getUsers({ limit: 3, usersList: [MOCKS.USER.id] });

    expect(users).toMatchObject([MOCKS.USER]);
  });

  test('Returns empty list when API call fails', async () => {
    mock.onGet(apiUrl).reply(404);

    const users = await getUsers({});
    expect(users).toMatchObject([]);
  });
});
