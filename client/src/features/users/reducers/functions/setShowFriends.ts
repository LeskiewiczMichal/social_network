import { PayloadAction } from '@reduxjs/toolkit';

const setShowFriendsReducer = (state: any, action: PayloadAction<boolean>) => {
  state.showFriends = action.payload;
};

export default setShowFriendsReducer;
