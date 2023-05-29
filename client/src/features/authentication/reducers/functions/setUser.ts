import { PayloadAction } from '@reduxjs/toolkit';

import { UserState } from '../../types/userState';

const setUserReducer = (state: any, action: PayloadAction<UserState>) => {
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
};

export default setUserReducer;
