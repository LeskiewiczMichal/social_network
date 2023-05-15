import { screen, fireEvent } from '@testing-library/react';

import { renderWithProviders } from '../../../../utils/test_utils';
import LoginForm from '../LoginForm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAppDispatch } from '../../../../hooks';
import login from '../../actions/login';

const mockUseAppDispatch = jest.fn();
const mockUseAppSelector = jest.fn();
jest.mock('../../../../hooks', () => ({
  useAppSelector: () => mockUseAppSelector,
  useAppDispatch: () => mockUseAppDispatch,
}));
jest.mock('../../actions/login', () => jest.fn());

describe('Login form test', () => {
  test('renders correctly', () => {
    renderWithProviders(<LoginForm />);

    // Logo
    expect(screen.getByRole('img')).toBeInTheDocument();

    // Headers
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Sign in to your account');
    expect(headings[1]).toHaveTextContent(
      'Not a member? Click here to register',
    );

    // Inputs
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    // Link to registration
    const registerLink = screen.getByRole('link');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveTextContent('Click here to register');

    // Line with text
    expect(screen.getByText('Or continue with')).toBeInTheDocument();

    // Buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveTextContent('Sign In');
    expect(buttons[1]).toHaveTextContent('Google');
    expect(buttons[2]).toHaveTextContent('Offline');
  });

  describe('Buttons functionality', () => {
    beforeEach(() => {
      renderWithProviders(<LoginForm />);
    });

    test('Sign in dispatches login', () => {
      const button = screen.getByText('Sign In');
      expect(button).toBeInTheDocument();

      fireEvent.click(button);

      expect(mockUseAppDispatch).toHaveBeenCalled();
      expect(login).toHaveBeenCalledWith({ email: '', password: '' });
    });

    test('Google dispatches login', () => {
      const button = screen.getByText('Offline');

      expect(button).toBeInTheDocument();
      fireEvent.click(button);

      expect(mockUseAppDispatch).toHaveBeenCalled();
      expect(login).toHaveBeenCalledWith({ email: '', password: '' });
    });
  });

  describe('Form data', () => {
    beforeEach(() => {
      renderWithProviders(<LoginForm />);
    });

    test('email input working properly', () => {
      const input = screen.getByLabelText('Email address');
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 'A' } });

      expect(screen.getByDisplayValue('A')).toBeInTheDocument();
    });

    test('password input working properly', () => {
      const input = screen.getByLabelText('Email address');
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 'pass' } });

      expect(screen.getByDisplayValue('pass')).toBeInTheDocument();
    });
  });
});
