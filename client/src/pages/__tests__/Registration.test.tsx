import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../utils/test_utils';
import Registration from '../Registration';

// Mock LoginForm component
jest.mock('../../features/authentication/components/RegistrationForm', () => {
  return function RegistrationForm() {
    return <div data-testid="mock-registration-form" />;
  };
});

describe('Login page', () => {
  beforeEach(() => {
    renderWithProviders(<Registration />);
  });

  test('Renders RegistrationForm', () => {
    const registrationForm = screen.getByTestId('mock-registration-form');
    expect(registrationForm).toBeInTheDocument();
  });
});
