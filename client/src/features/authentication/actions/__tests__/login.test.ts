import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { useDispatch } from 'react-redux';
import login from '../login';
import { setUser } from '../../../../store/reducers/userReducer';

let mock: MockAdapter;
let mockDispatch: jest.Mock<any, any>;

jest.mock('react-redux');

beforeAll(() => {
  mock = new MockAdapter(axios);
  mockDispatch = jest.fn();
  (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
});

afterEach(() => {
  mock.reset();
  mockDispatch.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe('When API call is successful', () => {
  test('should dispatch user to reducer', async () => {
    mock
      .onPost(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/login`)
      .reply(200, {
        user: {
          _id: '2115',
          firstName: 'test',
          lastName: 'test',
          email: 'test@mail.pl',
          friends: [],
          friendRequests: [],
          birthday: '2020-01-01',
          country: 'test',
          city: 'test',
          postalCode: 'test',
          about: 'test',
          profilePicture: 'test',
        },
      });

    const expectedAction = setUser({
      id: '2115',
      firstName: 'test',
      lastName: 'test',
      email: 'test@mail.pl',
      friends: [],
      friendRequests: [],
      birthday: '2020-01-01',
      country: 'test',
      city: 'test',
      postalCode: 'test',
      about: 'test',
      profilePicture: 'test',
    });

    await login({
      email: 'test@mail.pl',
      password: 'test',
    });

    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });
});
