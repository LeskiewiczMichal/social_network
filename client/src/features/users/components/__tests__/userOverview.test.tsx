import { screen } from '@testing-library/react';

import UserOverview from '../UserOverview';
import {
  setupMocks,
  resetMocks,
  restoreMocks,
} from '../../../../utils/setupTest';
import {
  MOCKS,
  createTestStore,
  renderWithProviders,
} from '../../../../utils/test_utils';
import { UserSlice } from '../../../authentication';
import { profilePageSlice } from '../../reducers/profilePageReducer';

describe('User overview component', () => {
  beforeEach(() => {
    setupMocks();
    const store = createTestStore();
    store.dispatch(UserSlice.setUser({ ...MOCKS.USER, friendRequests: [] }));
    store.dispatch(
      profilePageSlice.actions.setUser({ ...MOCKS.USER, friendRequests: [] }),
    );
    const formData = {
      about: '',
      city: '',
      birthday: '',
      country: '',
      email: '',
    };
    const handleChangeData = jest.fn();
    const handleConfirmChanges = jest.fn();
    renderWithProviders(
      <UserOverview
        changeUserDataForm={formData}
        handleChangeUserData={handleChangeData}
        handleConfirmChanges={handleConfirmChanges}
      />,
      { store },
    );
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

    test('renders edit prorfile when its your profile', () => {
      expect(
        screen.getByRole('button', { name: 'Edit profile' }),
      ).toBeInTheDocument();
    });
  });
});
