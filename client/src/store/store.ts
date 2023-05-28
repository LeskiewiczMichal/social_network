import { configureStore } from '@reduxjs/toolkit';

import userReducer from '../features/authentication/reducers/userReducer';
import errorReducer from './reducers/errorReducer';
import profilePageReducer from '../features/users/reducers/profilePageReducer';
import socketReducer from '../features/authentication/reducers/socketReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
    profilePage: profilePageReducer,
    socket: socketReducer,
  },
});

export default store;
