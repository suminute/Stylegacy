import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: false
};
const storeAddSlice = createSlice({
  name: 'storeAdd',
  initialState,
  reducers: {
    openStoreModal: (state, action) => {
      state = action.payload;
      return state;
    }
  }
});

export const { openStoreModal } = storeAddSlice.actions;
export default storeAddSlice.reducer;
