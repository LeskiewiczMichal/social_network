import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SocketState } from '../types/socketState';

const initialState: SocketState = {
  socket: null,
};

const setSocketState = (state: any, action: PayloadAction<SocketState>) => {
  state.socket = action.payload.socket;
};

export const socketSlice = createSlice({
  name: 'Socket',
  initialState,
  reducers: {
    setSocket: setSocketState,
  },
});

export const { setSocket } = socketSlice.actions;

export default socketSlice.reducer;
