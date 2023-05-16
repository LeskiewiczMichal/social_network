import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { NavigateFunction } from 'react-router-dom';

import { renderWithProviders } from '../../../../utils/test_utils';
import RegistrationForm, { initialFormData } from '../RegistrationForm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAppDispatch } from '../../../../hooks';
import register from '../../actions/register';

const mockUseAppSelector = jest.fn();
const mockUseAppDispatch = jest.fn();
jest.mock('../../../../hooks', () => ({
  useAppSelector: () => mockUseAppSelector,
  useAppDispatch: () => mockUseAppDispatch,
}));
jest.mock('../../actions/register', () => jest.fn());

describe('Register form test', () => {
  test('Renders correctly', () => {
    renderWithProviders(<RegistrationForm />);

    // Headers
    const headers = screen.getAllByRole('heading');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent('Personal Information');
    expect(headers[1]).toHaveTextContent('Profile');

    // Inputs
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Birthday')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('ZIP / Postal code')).toBeInTheDocument();
    expect(screen.getByLabelText('About')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload profile picture')).toBeInTheDocument();

    // Texts
    expect(
      screen.getByText(
        'Informations will be displayed publicly so be careful what you share.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Give us some info about yourself.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Write a few sentences.')).toBeInTheDocument();

    // Buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Cancel');
    expect(buttons[1]).toHaveTextContent('Save');

    // Picture preview
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  describe('Buttons functionality', () => {
    beforeEach(() => {
      renderWithProviders(<RegistrationForm />);
    });

    test('Save dispatches register action', async () => {
      const button = screen.getByText('Save');

      await act(async () => {
        userEvent.click(button);
      });

      expect(mockUseAppDispatch).toHaveBeenCalled();
      expect(register).toHaveBeenCalledWith({
        ...initialFormData,
        navigate: expect.any(Function) as NavigateFunction,
      });
    });
  });

  describe('Form data', () => {
    beforeEach(() => {
      renderWithProviders(<RegistrationForm />);
    });

    test('first name working correctly', async () => {
      const input = screen.getByLabelText('First name');

      await act(async () => {
        await userEvent.type(input, 'test');
      });

      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    });

    test('last name working correctly', async () => {
      const input = screen.getByLabelText('Last name');

      await act(async () => {
        await userEvent.type(input, 'test');
      });

      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    });

    test('email address working correctly', async () => {
      const input = screen.getByLabelText('Email address');

      await act(async () => {
        await userEvent.type(input, 'test');
      });

      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    });

    test('password working correctly', async () => {
      const input = screen.getByLabelText('Password');

      await act(async () => {
        await userEvent.type(input, 'test');
      });
      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    });

    test('birthday working correctly', async () => {
      const input = screen.getByLabelText('Birthday');

      await act(async () => {
        await userEvent.type(input, '2010-05-05');
      });

      expect(screen.getByDisplayValue('2010-05-05')).toBeInTheDocument();
    });

    test('country working correctly', async () => {
      const input = screen.getByLabelText('Country');

      await act(async () => {
        userEvent.selectOptions(input, 'Brazil');
      });

      expect(screen.getByDisplayValue('Brazil')).toBeInTheDocument();
    });

    test('city working correctly', async () => {
      const input = screen.getByLabelText('City');

      await act(async () => {
        await userEvent.type(input, 'test');
      });

      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    });

    test('ZIP / Postal code working correctly', async () => {
      const input = screen.getByLabelText('ZIP / Postal code');

      await act(async () => {
        await userEvent.type(input, '20-200');
      });

      expect(screen.getByDisplayValue('20-200')).toBeInTheDocument();
    });

    test('about code working correctly', async () => {
      const input = screen.getByLabelText('About');

      await act(async () => {
        await userEvent.type(input, 'test');
      });
      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    });

    test('profile picture upload working correctly', async () => {
      const input: HTMLInputElement = screen.getByLabelText(
        'Upload profile picture',
      );
      const testFile = new File(['(⌐□_□)'], 'test.png', {
        type: 'image/png',
      });

      await act(async () => {
        userEvent.upload(input, testFile);
      });

      if (!input.files) {
        fail('No files in input');
      }

      expect(input.files[0].name).toBe('test.png');
      expect(input.files?.length).toBe(1);
    });
  });
});
