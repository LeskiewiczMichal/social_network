import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { PreloadedState } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { UserInterface } from '../features/users/types/user';
import userReducer from '../features/authentication/reducers/userReducer';
import errorReducer from '../store/reducers/errorReducer';
import setupStore from '../store/store';
import type { RootState } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAppDispatch, useAppSelector } from '../hooks';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: typeof setupStore;
}

const mockedUser: UserInterface = {
  id: 'test',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'test@mail.pl',
  country: 'test',
  city: 'test',
  postalCode: 'test',
  about: 'test',
  friends: [],
  friendRequests: [],
  birthday: 'test',
  profilePicture: 'test',
};

const postProps = {
  id: 'test',
  title: 'Test Title',
  body: 'This is testing body',
  author: mockedUser,
  comments: [],
  likes: [],
  photo: null,
  createdAt: new Date('2020-01-01'),
};

const MOCKS = {
  USER: mockedUser,
  POST: postProps,
};

function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
      user: {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        friends: null,
        country: null,
        city: null,
        postalCode: null,
        about: null,
        friendRequests: null,
        birthday: null,
        profilePicture: null,
        googleId: null,
      },
      error: {
        loginError: null,
        registerError: null,
      },
    },
    store = configureStore({
      reducer: { user: userReducer, error: errorReducer },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

const createTestStore = () => {
  const store = configureStore({
    reducer: {
      user: userReducer,
      error: errorReducer,
    },
  });

  return store;
};

export { renderWithProviders, createTestStore, MOCKS };
