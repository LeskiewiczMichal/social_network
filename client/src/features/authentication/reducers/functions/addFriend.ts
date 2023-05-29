import { PayloadAction } from '@reduxjs/toolkit';

const addFriendReducer = (state: any, action: PayloadAction<string>) => {
  state.friends = [...state.friends, action.payload];
};

export default addFriendReducer;
