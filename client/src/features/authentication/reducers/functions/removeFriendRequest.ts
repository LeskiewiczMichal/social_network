import { PayloadAction } from '@reduxjs/toolkit';

const removeFriendRequestReducer = (
  state: any,
  action: PayloadAction<string>,
) => {
  state.friendRequests = state.friendRequests.filter(
    (friendRequest: string) => friendRequest !== action.payload,
  );
};

export default removeFriendRequestReducer;
