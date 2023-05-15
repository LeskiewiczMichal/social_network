import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as UserTypes from '../../types/user';

const initialState: UserTypes.UserState = {
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

export const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserTypes.User>) => {
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
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
