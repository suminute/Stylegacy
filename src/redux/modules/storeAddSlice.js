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
      state = action.payload;
      return { state: state };
    }
  }
});

export const { openStoreModal, openMarkerStoreModal } = storeAddSlice.actions;
export default storeAddSlice.reducer;
