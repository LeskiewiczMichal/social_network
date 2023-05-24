import { configureStore } from '@reduxjs/toolkit';

import userReducer from '../features/authentication/reducers/userReducer';
import errorReducer from './reducers/errorReducer';
import profilePageReducer from '../features/users/reducers/profilePageReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
    profilePage: profilePageReducer,
  },
});

export default store;
