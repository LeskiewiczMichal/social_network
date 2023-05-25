import { screen, waitFor } from '@testing-library/react';

import CommentsSection from '../CommentsSection';
import { renderWithProviders, MOCKS } from '../../../../utils/test_utils';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  mock,
} from '../../../../utils/setupTest';

describe('Comments section', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
  });

  test('Renders properly', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ABCD');
    mock
      .onGet(
        `${process.env.REACT_APP_SERVER_URL}/api/comments/${MOCKS.POST.id}?sortOrder=desc&limit=2&offset=0`,
      )
      .reply(200, {
        comments: [
          {
            _id: 'testId',
            body: 'This is test comment body',
            author: { ...MOCKS.USER, _id: 'testId' },
            createdAt: new Date('2020-01-01'),
            updatedAt: new Date('2020-01-01'),
            likes: [],
            post: MOCKS.POST.id,
          },
        ],
      });

    renderWithProviders(
      <CommentsSection numberOfComments={10} postId={MOCKS.POST.id} />,
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Profile picture
    const profilePictures = screen.getAllByRole('link', { name: 'Profile' });
    expect(profilePictures).toHaveLength(2);

    // Author name
    const authorName = screen.getByRole('link', { name: 'author profile' });
    expect(authorName).toBeInTheDocument();
    expect(authorName).toHaveTextContent(
      `${MOCKS.POST.author.firstName} ${MOCKS.POST.author.lastName}`,
    );

    // Creation date
    const date = screen.getByText(/.* .* ago/);
    expect(date).toBeInTheDocument();

    // Body
    const body = screen.getByText('This is test comment body');
    expect(body).toBeInTheDocument();

    // Hearts button
    const heartsButton = screen.getByRole('button', { name: 'hearts' });
    expect(heartsButton).toBeInTheDocument();
    expect(heartsButton).toHaveTextContent('0');
  });
});
