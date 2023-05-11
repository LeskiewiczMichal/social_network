import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTypes } from '../../types';

const initialState: UserTypes.UserState = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  friends: null,
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
      if (action.payload.googleId) {
        state.googleId = action.payload.googleId;
      }
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
