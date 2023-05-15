import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import login from '../login';

let mock: MockAdapter;

beforeAll(() => {
  mock = new MockAdapter(axios);
});

afterEach(() => {
  mock.reset();
});

describe('When API call is successful', () => {
  test('should dispatch user to reducer', (done) => {
    mock
      .onPost(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/login`)
      .reply(200, {
        user: {
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
        },
      });

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/users/auth/login`, {
        email: 'test@mail.pl',
        password: 'test',
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

// import React from 'react';
// import axios from 'axios';
// import { render, screen } from '@testing-library/react';
// import { Login } from '../../../../pages';

// test('renders learn react link', () => {
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
