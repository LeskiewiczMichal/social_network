import { screen, waitFor } from '@testing-library/react';

import PostsSection from '../PostsSection';
import { MOCKS, renderWithProviders } from '../../../../utils/test_utils';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  mock,
} from '../../../../utils/setupTest';

// Mock Post component
jest.mock('../Post', () => {
  return function Post() {
    return <div data-testid="mock-post" />;
  };
});
// Mock LoadingSpinner component
jest.mock('../../../../components/LoadingSpinner', () => {
  return function LoadingSpinner() {
    return <div data-testid="mock-spinner" />;
  };
});

describe('Posts section', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
  });

  test('Renders post properly', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD');
    mock
      .onGet(new RegExp(`${process.env.REACT_APP_SERVER_URL}/api/posts.*`))
      .reply(200, {
        posts: [
          {
            ...MOCKS.POST,
            _id: MOCKS.POST.id,
            author: { ...MOCKS.POST.author, _id: MOCKS.POST.author.id },
          },
        ],
      });

    renderWithProviders(<PostsSection />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-post')).toBeInTheDocument();
    });

    const post = screen.getByTestId('mock-post');
    expect(post).toBeInTheDocument();
  });

  test('Renders loading while getting posts from server', () => {
    renderWithProviders(<PostsSection />);

    expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
  });
});
