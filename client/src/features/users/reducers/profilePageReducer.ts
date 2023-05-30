import { createSlice } from '@reduxjs/toolkit';

import { ProfilePageState } from '../types/profilePageState';
import setUserReducer from './functions/setUser';
import setShowFriendsReducer from './functions/setShowFriends';
import addFriendReducer from './functions/addFriend';
import removeFriendReducer from './functions/removeFriend';
import addFriendRequestReducer from './functions/addFriendRequest';
import removeFriendRequestReducer from './functions/removeFriendRequest';
import setEditUserActiveReducer from './functions/setEditUserActive';

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
  editUserActive: false,
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
    setEditUserActive: setEditUserActiveReducer,
  },
});

export const {
  setUser,
  setShowFriends,
  addFriend,
  removeFriend,
  addFriendRequest,
  removeFriendRequest,
  setEditUserActive,
} = profilePageSlice.actions;

export default profilePageSlice.reducer;
