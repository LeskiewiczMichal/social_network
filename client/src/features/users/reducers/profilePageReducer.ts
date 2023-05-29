import { createSlice } from '@reduxjs/toolkit';

import { ProfilePageState } from '../types/profilePageState';
import setUserReducer from './functions/setUser';
import setShowFriendsReducer from './functions/setShowFriends';

const initialState: ProfilePageState = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  friends: [],
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
  },
});

export const { setUser, setShowFriends } = profilePageSlice.actions;

export default profilePageSlice.reducer;
