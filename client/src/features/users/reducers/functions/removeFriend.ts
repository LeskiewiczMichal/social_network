import { PayloadAction } from '@reduxjs/toolkit';

const removeFriendReducer = (state: any, action: PayloadAction<string>) => {
  state.friends = state.friends.filter(
    (friend: string) => friend !== action.payload,
  );
};

export default removeFriendReducer;
