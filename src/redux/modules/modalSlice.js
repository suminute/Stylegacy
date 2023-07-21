import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogInModalOpen: false,
  isSignUpModalOpen: false,
  isAlertModalOpen: false,
  alertMessage: ''
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    toggleLogInModal: (state) => {
      state.isLogInModalOpen = !state.isLogInModalOpen;
    },
    toggleSignUpModal: (state) => {
      state.isSignUpModalOpen = !state.isSignUpModalOpen;
    },
    toggleAlertModal: (state) => {
      state.isAlertModalOpen = !state.isAlertModalOpen;
    },
    setAlertMessage: (state, action) => {
      state.alertMessage = action.payload;
    },
    clearAlertMessage: (state) => {
      state.alertMessage = '';
    }
  }
});

export const { toggleLogInModal, toggleSignUpModal, toggleAlertModal, setAlertMessage, clearAlertMessage } =
  modalsSlice.actions;

export default modalsSlice.reducer;
