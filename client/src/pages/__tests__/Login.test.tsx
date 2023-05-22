import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../utils/test_utils';
import Login from '../Login';

// // Mock LoginForm component
jest.mock('../../features/authentication/components/LoginForm', () => {
  return function LoginForm() {
    return <div data-testid="mock-login-form" />;
  };
});

describe('Login page', () => {
  beforeEach(() => {
    renderWithProviders(<Login />);
  });

  test('Renders LoginForm', () => {
    const loginForm = screen.getByTestId('mock-login-form');
    expect(loginForm).toBeInTheDocument();
  });

  test('renders image', () => {
    const image = screen.getByRole('img', {
      name: 'People connected with each other',
    });

    expect(image).toBeInTheDocument();
  });
});
