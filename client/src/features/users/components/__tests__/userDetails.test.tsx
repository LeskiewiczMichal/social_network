import { fireEvent, screen } from '@testing-library/react';

import UserDetails from '../UserDetails';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  mock,
  store,
} from '../../../../utils/setupTest';
import { MOCKS, renderWithProviders } from '../../../../utils/test_utils';

describe('User details component', () => {
  beforeEach(() => {
    setupMocks();
    // Mock API to return user
    mock
      .onGet(`${process.env.REACT_APP_SERVER_URL}/api/users`)
      .reply(200, { users: [{ ...MOCKS.USER, _id: MOCKS.USER.id }] });

    renderWithProviders(<UserDetails />, { store });
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
  });

  // Rendering tests
  describe('Renders correctly', () => {
    test('renders mutual friends count', () => {
      expect(screen.getByText('0 mutual friends')).toBeInTheDocument();
    });

    test('renders button to see all friends', () => {
      expect(
        screen.getByRole('button', { name: 'Click here to see all' }),
      ).toBeInTheDocument();
    });

    test('renders user info', () => {
      expect(screen.getByText('User info')).toBeInTheDocument();

      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('test@mail.pl')).toBeInTheDocument();

      expect(screen.getByText('Birthday:')).toBeInTheDocument();
      expect(screen.getByText('January 1, 2020')).toBeInTheDocument();

      expect(screen.getByText('Country:')).toBeInTheDocument();
      expect(screen.getByText('testCountry')).toBeInTheDocument();

      expect(screen.getByText('City:')).toBeInTheDocument();
      expect(screen.getByText('testCity')).toBeInTheDocument();
    });
  });

  test('See all friends button changes showFriends state', () => {
    const button = screen.getByRole('button', {
      name: 'Click here to see all',
    });
    fireEvent.click(button);
    // Check if state was changes to true
    expect(store.getState().profilePage.showFriends).toBeTruthy();
  });
});
