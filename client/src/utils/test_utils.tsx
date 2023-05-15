import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { PreloadedState } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import userReducer from '../store/reducers/userReducer';
import setupStore from '../store/store';
import type { RootState } from '../types';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: typeof setupStore;
}

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
    },
    store = configureStore({ reducer: { user: userReducer }, preloadedState }),
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

export { renderWithProviders };
