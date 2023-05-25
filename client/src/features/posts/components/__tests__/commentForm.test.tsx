import { screen, fireEvent } from '@testing-library/react';

import CommentForm from '../CommentForm';
import { renderWithProviders, MOCKS } from '../../../../utils/test_utils';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
} from '../../../../utils/setupTest';

beforeEach(() => {
  setupMocks();
});

afterEach(() => {
  resetMocks();
});

afterAll(() => {
  restoreMocks();
});

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
