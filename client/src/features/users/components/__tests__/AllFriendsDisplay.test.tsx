import { screen, waitFor } from '@testing-library/react';

import AllFriendsDisplay from '../AllFriendsDisplay';
import { MOCKS, renderWithProviders } from '../../../../utils/test_utils';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  mock,
} from '../../../../utils/setupTest';

// Mock LoadingSpinner component
jest.mock('../../../../components/LoadingSpinner', () => {
  return function LoadingSpinner() {
    return <div data-testid="mock-spinner" />;
  };
});

describe('All friends display', () => {
  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
  });

  describe('When API call is succesfull', () => {
    beforeEach(() => {
      // Mock API to return user
      mock
        .onGet(`${process.env.REACT_APP_SERVER_URL}/api/users`)
        .reply(200, { users: [{ ...MOCKS.USER, _id: MOCKS.USER.id }] });

      renderWithProviders(<AllFriendsDisplay />);
    });

    afterEach(() => {
      mock.reset();
    });

    test('renders spinner', async () => {
      expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
    });

    test('Renders friends', async () => {
      // Wait for friends to be fetched
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: "friend's profile" }),
        ).toBeInTheDocument();
      });

      // Link to friend's profile
      const linkToFriendProfile = screen.getByRole('link');
      expect(linkToFriendProfile).toBeInTheDocument();
      expect(linkToFriendProfile).toHaveTextContent(
        `${MOCKS.USER.firstName} ${MOCKS.USER.lastName}`,
      );
      expect(linkToFriendProfile).toHaveAttribute(
        'href',
        `/profile/${MOCKS.USER.id}`,
      );

      // Friends profile picture
      const friendsImage = screen.getByRole('img', {
        name: 'friends profile picture',
      });
      expect(friendsImage).toBeInTheDocument();
    });

    test('Renders text and close button', async () => {
      // Wait for friends to be fetched
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: "friend's profile" }),
        ).toBeInTheDocument();
      });

      // Text
      expect(screen.getByText("'s friends:")).toBeInTheDocument();

      // Close button
      expect(
        screen.getByRole('button', { name: 'close popup' }),
      ).toBeInTheDocument();
    });
  });
});
