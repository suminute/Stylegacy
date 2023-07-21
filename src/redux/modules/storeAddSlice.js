import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: false
};
const storeAddSlice = createSlice({
  name: 'storeAdd',
  initialState,
  reducers: {
    openMarkerStoreModal: (state, action) => {
      console.log(action);
      const { bool, clickLocation } = action.payload;
      console.log(bool, clickLocation);
      return (state = { state: bool, clickLocation });
    },
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

export const { openStoreModal, openMarkerStoreModal, closeStoreModal } = storeAddSlice.actions;
export default storeAddSlice.reducer;
