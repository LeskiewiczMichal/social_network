import { screen, fireEvent } from '@testing-library/react';
import { useDispatch } from 'react-redux';

import { renderWithProviders } from '../../../../utils/test_utils';
import LoginForm from '../LoginForm';
// import login from '../../actions/login';

// jest.mock('../../actions/login');
jest.mock('react-redux');

describe('Login form test', () => {
  let mockDispatch: jest.Mock<any, any>;
  let useDispatch: any;

  beforeAll(() => {
    useDispatch = jest.fn(() => jest.fn());
    mockDispatch = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterAll(() => {
    mockDispatch.mockClear();
  });

  test('renders correctly', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByRole('img')).toBeInTheDocument();

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Sign in to your account');
    expect(headings[1]).toHaveTextContent(
      'Not a member? Click here to register',
    );

    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    const registerLink = screen.getByRole('link');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveTextContent('Click here to register');

    expect(screen.getByText('Or continue with')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveTextContent('Sign In');
    expect(buttons[1]).toHaveTextContent('Google');
    expect(buttons[2]).toHaveTextContent('Offline');
  });

  test('Sign in button dispatches login', () => {
    const { store } = renderWithProviders(<LoginForm />);
    const loginSpy = jest.spyOn('../../actions/login', 'login');

    const button = screen.getByText('Sign In');

    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    expect(mockDispatch).toHaveBeenCalled();
  });
});
