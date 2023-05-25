import { screen } from '@testing-library/react';

import UserOverview from '../UserOverview';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
  store,
} from '../../../../utils/setupTest';
import { MOCKS, renderWithProviders } from '../../../../utils/test_utils';

describe('User overview component', () => {
  beforeEach(() => {
    setupMocks();
    renderWithProviders(<UserOverview />, { store });
  });

  afterEach(() => {
    resetMocks();
  });

  afterAll(() => {
    restoreMocks();
  });

  describe('Renders correctly', () => {
    test('renders profile picture', () => {
      expect(
        screen.getByRole('img', {
          name: `${MOCKS.USER.firstName} ${MOCKS.USER.lastName}`,
        }),
      ).toBeInTheDocument();
    });

    test('renders user name and surname', () => {
      expect(
        screen.getByRole('heading', {
          name: `${MOCKS.USER.firstName} ${MOCKS.USER.lastName}`,
        }),
      ).toBeInTheDocument();
    });

    test("renders user's about me text", () => {
      expect(screen.getByText(MOCKS.USER.about)).toBeInTheDocument();
    });

    test('renders two buttons', () => {
      expect(
        screen.getByRole('button', { name: 'Add friend' }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Message' }),
      ).toBeInTheDocument();
    });
  });
});
