import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: false
};
const storeAddSlice = createSlice({
  name: 'storeAdd',
  initialState,
  reducers: {
    openMarkerStoreModal: (state, action) => {
      const { bool, clickLocation } = action.payload;
      return (state = { state: bool, clickLocation });
    },
    openStoreModal: (state, action) => {
      state.state = action.payload;
      return state;
    },
    closeStoreModal: (state, action) => {
      state = action.payload;
      return state;
    }
  }
});

export const { openStoreModal, openMarkerStoreModal, closeStoreModal } = storeAddSlice.actions;
export default storeAddSlice.reducer;
