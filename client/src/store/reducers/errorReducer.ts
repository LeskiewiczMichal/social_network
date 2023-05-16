import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ErrorState } from '../../types/error';

const initialState: ErrorState = {
  loginError: null,
  registerError: null,
};

export const errorSlice = createSlice({
  name: 'Error',
  initialState,
  reducers: {
    setLoginError: (state, action: PayloadAction<string | null>) => {
      state.loginError = action.payload;
    },
    setRegisterError: (state, action: PayloadAction<string | null>) => {
      state.registerError = action.payload;
    },
  },
});

export const { setLoginError, setRegisterError } = errorSlice.actions;

export default errorSlice.reducer;
