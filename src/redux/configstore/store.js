import { configureStore } from '@reduxjs/toolkit';
import mapSlice from '../modules/mapSlice';
import user from '../modules/userSlice';
const store = configureStore({
  reducer: {
    mapSlice: mapSlice,
    user
  }
});

export default store;
