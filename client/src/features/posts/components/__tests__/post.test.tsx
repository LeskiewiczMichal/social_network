import { screen } from '@testing-library/react';

import Post from '../Post';
import { renderWithProviders, MOCKS } from '../../../../utils/test_utils';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
} from '../../../../utils/setupTest';

beforeEach(() => {
  setupMocks();
});

afterEach(() => {
  resetMocks();
});

afterAll(() => {
  restoreMocks();
});

test('Rendes properly', () => {
  renderWithProviders(
    <Post
      id={MOCKS.POST.id}
      title={MOCKS.POST.title}
      body={MOCKS.POST.body}
      author={MOCKS.POST.author}
      comments={MOCKS.POST.comments}
      likes={MOCKS.POST.likes}
      photo={MOCKS.POST.photo}
      createdAt={MOCKS.POST.createdAt}
      updatedAt={MOCKS.POST.createdAt}
    />,
  );

  // Profile picture
  const profilePicture = screen.getByRole('link', { name: 'Profile' });
  expect(profilePicture).toBeInTheDocument();

  // User name and post title
  const headings = screen.getAllByRole('heading');
  expect(headings).toHaveLength(2);
  const name = headings[0];
  const title = headings[1];
  expect(name).toBeInTheDocument();
  expect(name).toHaveTextContent('firstName lastName');
  expect(title).toBeInTheDocument();
  expect(title).toHaveTextContent('Test Title');

  // Post body
  const body = screen.getByText('This is testing body');
  expect(body).toBeInTheDocument();

  // Date
  const date = screen.getByText(/.* years ago/);
  expect(date).toBeInTheDocument();

  // Hearts and comments
  const hearts = screen.getByRole('button', { name: 'give a heart' });
  expect(hearts).toBeInTheDocument();
  expect(hearts).toHaveTextContent('0');
  const commentsAndHearts = screen.getAllByText('0');
  expect(commentsAndHearts).toHaveLength(2);
});
