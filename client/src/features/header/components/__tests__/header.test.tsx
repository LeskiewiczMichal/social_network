import { screen, fireEvent } from '@testing-library/react';

import Header from '../Header';
import { renderWithProviders } from '../../../../utils/test_utils';
import { logout } from '../../../authentication';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAppDispatch } from '../../../../hooks';

const mockUseAppDispatch = jest.fn();
const mockUseAppSelector = jest.fn();
jest.mock('../../../../hooks', () => ({
  useAppSelector: () => mockUseAppSelector,
  useAppDispatch: () => mockUseAppDispatch,
}));
jest.mock('../../../authentication/actions/logout', () => jest.fn());

test('Rendes properly', () => {
  renderWithProviders(<Header />);

  // Logo
  const logo = screen.getByLabelText('Go to homepage');
  expect(logo).toBeInTheDocument();

  // Search bar
  const searchInput = screen.getByRole('searchbox');
  expect(searchInput).toBeInTheDocument();

  // Chat button
  const chatButton = screen.getByRole('button', { name: 'Go to chat' });
  expect(chatButton).toBeInTheDocument();

  // Notifications button
  const notificationsButton = screen.getByRole('button', {
    name: 'Drop down notifications',
  });
  expect(notificationsButton).toBeInTheDocument();

  // Profile button
  const profileButton = screen.getByRole('button', {
    name: 'Profile dropdown',
  });
  expect(profileButton).toBeInTheDocument();
});

describe('Profile dropdown', () => {
  beforeEach(() => {
    renderWithProviders(<Header />);
  });

  test('button shows dropdown on click', () => {
    const profileButton = screen.getByRole('button', {
      name: 'Profile dropdown',
    });
    fireEvent.click(profileButton);

    // Dropdown
    const profileDropdown = screen.getByRole('navigation', {
      name: 'Profile dropdown',
    });
    expect(profileDropdown).toBeInTheDocument();

    // Link to user profile
    const profileLink = screen.getByRole('link', { name: 'Profile' });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/profile/1232421');

    // Sign out button
    const singOutButton = screen.getByRole('button', { name: 'Sign out' });
    expect(singOutButton).toBeInTheDocument();
  });

  test('Sign out button ', () => {
    const profileButton = screen.getByRole('button', {
      name: 'Profile dropdown',
    });
    fireEvent.click(profileButton);

    const singOutButton = screen.getByRole('button', { name: 'Sign out' });
    fireEvent.click(singOutButton);

    expect(mockUseAppDispatch).toHaveBeenCalled();
    expect(logout).toHaveBeenCalled();
  });
});