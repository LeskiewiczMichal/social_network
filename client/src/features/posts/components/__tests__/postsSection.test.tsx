import { screen, waitFor } from '@testing-library/react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import PostsSection from '../PostsSection';
import { MOCKS, renderWithProviders } from '../../../../utils/test_utils';

TimeAgo.addLocale(en);

// Mock redux
const mockUseAppDispatch = jest.fn();
const mockUseAppSelector = jest.fn();
jest.mock('../../../../hooks', () => ({
  useAppSelector: () => mockUseAppSelector,
  useAppDispatch: () => mockUseAppDispatch,
}));
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

describe('Comments section', () => {
  // Set up axios mock and disable console error
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

  test('Renders post properly', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD');
    mock
      .onGet(
        `${process.env.REACT_APP_SERVER_URL}/api/posts?sortOrder=desc&limit=10&offset=0`,
      )
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
