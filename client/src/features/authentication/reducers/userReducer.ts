import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserState } from '../types/userState';
import { UserTypes } from '../../users';

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
  googleId: null,
};

const setUserReducer = (
  state: any,
  action: PayloadAction<UserState | UserTypes.UserInterface>,
) => {
  state.id = action.payload.id;
  state.firstName = action.payload.firstName;
  state.lastName = action.payload.lastName;
  state.email = action.payload.email;
  state.friends = action.payload.friends;
  state.friendRequests = action.payload.friendRequests;
  state.birthday = action.payload.birthday;
  state.profilePicture = action.payload.profilePicture;
  state.country = action.payload.country;
  state.city = action.payload.city;
  state.postalCode = action.payload.postalCode;
  state.about = action.payload.about;
  if (action.payload.googleId) {
    state.googleId = action.payload.googleId;
  }
};

export const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser: setUserReducer,
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;