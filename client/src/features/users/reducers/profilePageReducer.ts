import { createSlice } from '@reduxjs/toolkit';

import { ProfilePageState } from '../types/profilePageState';
import setUserReducer from './functions/setUser';
import setShowFriendsReducer from './functions/setShowFriends';
import addFriendReducer from './functions/addFriend';
import removeFriendReducer from './functions/removeFriend';
import addFriendRequestReducer from './functions/addFriendRequest';
import removeFriendRequestReducer from './functions/removeFriendRequest';

const initialState: ProfilePageState = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  friends: [],
  friendRequests: [],
  country: '',
  city: '',
  postalCode: '',
  about: '',
  birthday: '',
  profilePicture: '',
  showFriends: false,
};

export const profilePageSlice = createSlice({
  name: 'ProfilePage',
  initialState,
  reducers: {
    setUser: setUserReducer,
    setShowFriends: setShowFriendsReducer,
    addFriend: addFriendReducer,
    removeFriend: removeFriendReducer,
    addFriendRequest: addFriendRequestReducer,
    removeFriendRequest: removeFriendRequestReducer,
  },
});

export const {
  setUser,
  setShowFriends,
  addFriend,
  removeFriend,
  addFriendRequest,
  removeFriendRequest,
} = profilePageSlice.actions;

export default profilePageSlice.reducer;
