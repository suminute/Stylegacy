import { configureStore } from '@reduxjs/toolkit';
import mapSlice from '../modules/mapSlice';
import user from '../modules/userSlice';
import toggleSlice from '../modules/toggleSlice';
import storeAddSlice from '../modules/storeAddSlice';
const store = configureStore({
  reducer: {
    mapSlice: mapSlice,
    user,
    toggleSlice,
    storeAddSlice
  }
});

export default store;
