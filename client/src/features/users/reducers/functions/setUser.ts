import { PayloadAction } from '@reduxjs/toolkit';

interface SetUserReducerArgs {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  friends: string[];
  country: string;
  city: string;
  postalCode: string;
  about: string;
  birthday: string;
  profilePicture: string;
}

const setUserReducer = (
  state: any,
  action: PayloadAction<SetUserReducerArgs>,
) => {
  state.id = action.payload.id;
  state.firstName = action.payload.firstName;
  state.lastName = action.payload.lastName;
  state.email = action.payload.email;
  state.friends = action.payload.friends;
  state.birthday = action.payload.birthday;
  state.profilePicture = action.payload.profilePicture;
  state.country = action.payload.country;
  state.city = action.payload.city;
  state.postalCode = action.payload.postalCode;
  state.about = action.payload.about;
};

export default setUserReducer;
