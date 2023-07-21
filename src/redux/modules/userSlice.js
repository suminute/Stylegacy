import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    userId: null,
    userName: null,
    userEmail: null
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        return state;
      } else {
        state.user = initialState.user;
      }
    },
    changeUser: (state, action) => {
      if (action.payload) {
        state.user.userName = action.payload;
        return state;
      } else {
        state.user = initialState.user;
      }
    },
    clearUser: (state) => {
      state.user = initialState.user;
    }
  }
});

export const { getUser, changeUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
