import { PayloadAction } from '@reduxjs/toolkit';

const addFriendRequestReducer = (state: any, action: PayloadAction<string>) => {
  state.friendRequests = [...state.friendRequests, action.payload];
};

export default addFriendRequestReducer;
