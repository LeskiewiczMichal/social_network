import { MOCKS } from '../../../../utils/test_utils';
import { DbQueries } from '../../../../types';
import getPosts from '../getPosts';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  mock,
} from '../../../../utils/setupTest';

describe('Get posts', () => {
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
