import { configureStore } from '@reduxjs/toolkit';
import mapSlice from '../modules/mapSlice';
import user from '../modules/userSlice';
import toggleSlice from '../modules/toggleSlice';
import storeAddSlice from '../modules/storeAddSlice';
import modals from '../modules/modalSlice';
import storeUpdateSlice from '../modules/storeUpdateSlice';

const store = configureStore({
  reducer: {
    mapSlice: mapSlice,
    user,
    toggleSlice,
    storeAddSlice,
    modals,
    storeUpdateSlice
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
