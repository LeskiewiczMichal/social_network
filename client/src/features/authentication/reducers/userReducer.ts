import { createSlice } from '@reduxjs/toolkit';

import { UserState } from '../types/userState';
import setUserReducer from './functions/setUser';
import addFriendRequestReducer from './functions/addFriendRequest';
import addFriendReducer from './functions/addFriend';
import removeFriendReducer from './functions/removeFriend';
import removeFriendRequestReducer from './functions/removeFriendRequest';

const initialState: UserState = {
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
};

export const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser: setUserReducer,
    addFriend: addFriendReducer,
    removeFriend: removeFriendReducer,
    addFriendRequest: addFriendRequestReducer,
    removeFriendRequest: removeFriendRequestReducer,
  },
});

export const {
  setUser,
  addFriend,
  addFriendRequest,
  removeFriend,
  removeFriendRequest,
} = userSlice.actions;

export default userSlice.reducer;
