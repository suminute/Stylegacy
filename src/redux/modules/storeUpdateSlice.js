import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpenUpdate: false,
  post: null
};
const storeUpdateSlice = createSlice({
  name: 'storeUpdate',
  initialState,
  reducers: {
    openStoreUpdateModal: (state, action) => {
      state.isOpenUpdate = true;
      state.post = action.payload.post;
      return state;
    },
    closeStoreUpdateModal: (state, action) => {
      state.isOpenUpdate = false;
      return state;
    }
  }
});

export const { openStoreUpdateModal, closeStoreUpdateModal } = storeUpdateSlice.actions;
export default storeUpdateSlice.reducer;
