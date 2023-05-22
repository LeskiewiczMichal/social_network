import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { MOCKS } from '../../../../utils/test_utils';
import { DbQueries } from '../../../../types';
import getPosts from '../getPosts';

describe('Get posts', () => {
  // Set up axios mock and turn off console error
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
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD');
    });

    test('Should return posts', async () => {
      // Mock API return value
      const limit = 5;
      const offset = 0;
      const mockPost = {
        ...MOCKS.POST,
        _id: 'test',
        author: { ...MOCKS.POST.author, _id: MOCKS.POST.author.id },
      };
      mock
        .onGet(
          `${process.env.REACT_APP_SERVER_URL}/api/posts?sortOrder=asc&limit=${limit}&offset=${offset}`,
        )
        .reply(200, {
          posts: [mockPost, mockPost],
        });

      const posts = await getPosts({
        sortOrder: DbQueries.SortOrder.ASCENDING,
        limit,
        offset,
      });

      expect(posts).toMatchObject([
        { ...MOCKS.POST, createdAt: MOCKS.POST.createdAt.toISOString() },
        { ...MOCKS.POST, createdAt: MOCKS.POST.createdAt.toISOString() },
      ]);
    });
  });

  describe('When API call fails', () => {
    test('Should return empty array', async () => {
      // Mock API return value
      const limit = 5;
      const offset = 0;
      mock
        .onGet(
          `${process.env.REACT_APP_SERVER_URL}/api/posts?sortOrder=asc&limit=${limit}&offset=${offset}}`,
        )
        .reply(404, {
          error: 'error',
        });

      const posts = await getPosts({
        sortOrder: DbQueries.SortOrder.ASCENDING,
        limit,
        offset,
      });

      expect(posts).toMatchObject([]);
    });
  });
});
