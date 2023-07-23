import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  type: null,
  clickLocation: null
};
const storeAddSlice = createSlice({
  name: 'storeAdd',
  initialState,
  reducers: {
    openStoreModal: (state, action) => {
      if (action.payload.clickLocation) {
        const isOpen = true;
        const clickLocation = action.payload.clickLocation;
        const type = action.payload.type;
        return { ...state, isOpen, type, clickLocation };
      }
      state.isOpen = true;
      state.type = action.payload.type;
      return state;
    },
    closeStoreModal: (state, action) => {
      return initialState;
    }
  }
});

export const { openStoreModal, closeStoreModal } = storeAddSlice.actions;
export default storeAddSlice.reducer;
