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
        state.userId = null;
        state.userName = null;
        state.userEmail = null;
        return state;
      }
    }
  }
});

export const { getUser } = userSlice.actions;
export default userSlice.reducer;
