import { PayloadAction } from '@reduxjs/toolkit';

const setEditUserActiveReducer = (
  state: any,
  action: PayloadAction<boolean>,
) => {
  state.editUserActive = action.payload;
};

export default setEditUserActiveReducer;
