import { getByRole, screen, waitFor, fireEvent } from '@testing-library/react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import CommentForm from '../CommentForm';
import { renderWithProviders, MOCKS } from '../../../../utils/test_utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAppDispatch } from '../../../../hooks';
import getComments from '../../actions/getComments';

TimeAgo.addLocale(en);

const mockUseAppDispatch = jest.fn();
const mockUseAppSelector = jest.fn();
jest.mock('../../../../hooks', () => ({
  useAppSelector: () => mockUseAppSelector,
  useAppDispatch: () => mockUseAppDispatch,
}));

describe('Comment form tests', () => {
  beforeEach(() => {
    renderWithProviders(<CommentForm postId={MOCKS.POST.id} />);
  });

  test('Renders propely', () => {
    // Form
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    // Profile picture
    const profilePicture = screen.getByRole('link', { name: 'Profile' });
    expect(profilePicture).toBeInTheDocument();

    // Text area
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  test('Send button is shown on focus', () => {
    // Get form
    const form = screen.getByRole('form', { name: 'add comment' });
    fireEvent.focus(form);

    // Send button
    const sendButton = screen.getByRole('button', { name: 'add comment' });
    expect(sendButton).toBeInTheDocument();
  });
});
