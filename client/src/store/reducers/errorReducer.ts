import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ErrorState } from '../../types/error';

const initialState: ErrorState = {
  loginError: null,
};

export const errorSlice = createSlice({
  name: 'Error',
  initialState,
  reducers: {
    setLoginError: (state, action: PayloadAction<string | null>) => {
      state.loginError = action.payload;
    },
  },
});

export const { setLoginError } = errorSlice.actions;

export default errorSlice.reducer;
