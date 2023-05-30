import dataToUserObject from './utils/dataToUserObject';
import * as UserTypes from './types/user';
import UserOverview from './components/UserOverview';
import UserDetails from './components/UserDetails';
import AllFriendsDisplay from './components/AllFriendsDisplay';
import { setUser, setShowFriends } from './reducers/profilePageReducer';
import getUsers from './services/getUsers';

const ProfilePageReducer = {
  setUser,
  setShowFriends,
};

export {
  dataToUserObject,
  UserTypes,
  UserOverview,
  UserDetails,
  AllFriendsDisplay,
  ProfilePageReducer,
  getUsers,
};
