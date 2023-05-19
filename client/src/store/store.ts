import { configureStore } from '@reduxjs/toolkit';

import userReducer from '../features/authentication/reducers/userReducer';
import errorReducer from './reducers/errorReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
  },
});

export default store;
