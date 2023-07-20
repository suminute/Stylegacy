import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: false
};
const storeAddSlice = createSlice({
  name: 'storeAdd',
  initialState,
  reducers: {
    openStoreModal: (state, action) => {
      state.state = action.payload;
      return state;
    },
    closeStoreModal: (state, action) => {
      state.state = action.payload;
      return state;
    }
  }
});

export const { openStoreModal, closeStoreModal } = storeAddSlice.actions;
export default storeAddSlice.reducer;
