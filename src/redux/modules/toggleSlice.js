import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  state: false,
  index: 0
};
const toggleSlice = createSlice({
  name: 'toggleMap',
  initialState,
  reducers: {
    toggleMap: (state, action) => {
      return (state = action.payload);
    }
  }
});

export const { toggleMap } = toggleSlice.actions;
export default toggleSlice.reducer;
