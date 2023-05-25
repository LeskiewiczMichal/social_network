import { fireEvent, screen, waitFor } from '@testing-library/react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit';

import AllFriendsDisplay from '../AllFriendsDisplay';
import {
  MOCKS,
  renderWithProviders,
  createTestStore,
} from '../../../../utils/test_utils';
import { ProfilePageState } from '../../types/profilePageState';
import { UserState } from '../../../authentication/types/userState';
import { ErrorState } from '../../../../types/error';
import { setUser as profilePageSetUser } from '../../reducers/profilePageReducer';
import { setUser as userReducerSetUser } from '../../../authentication/reducers/userReducer';

TimeAgo.addLocale(en);

// Mock redux
const mockUseAppDispatch = jest.fn();
const mockUseAppSelector = jest.fn();
jest.mock('../../../../hooks', () => ({
  useAppSelector: () => mockUseAppSelector,
  useAppDispatch: () => mockUseAppDispatch,
}));
// Mock LoadingSpinner component
jest.mock('../../../../components/LoadingSpinner', () => {
  return function LoadingSpinner() {
    return <div data-testid="mock-spinner" />;
  };
});

describe('All friends display', () => {
  // Set up axios mock and disable console error
  let mock: MockAdapter;
  const consoleErrorSpy = jest.spyOn(console, 'error');
  // Set up redux mocks
  let store: ToolkitStore<
    {
      user: UserState;
      error: ErrorState;
      profilePage: ProfilePageState;
    },
    AnyAction,
    [
      ThunkMiddleware<
        {
          user: UserState;
          error: ErrorState;
        },
        AnyAction
      >,
    ]
  >;
  let dispatch: jest.Mock<any, any>;
  let mockExtraArguments: {};

  beforeEach(() => {
    mock = new MockAdapter(axios);
    store = createTestStore();
    store.dispatch(profilePageSetUser(MOCKS.USER));
    store.dispatch(userReducerSetUser({ ...MOCKS.USER, friendRequests: [] }));
    dispatch = jest.fn();
    mockExtraArguments = {};
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    consoleErrorSpy.mockRestore();
  });

  beforeAll(() => {
    consoleErrorSpy.mockImplementation(() => {});
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
