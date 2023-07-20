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
    },
    changeUser: (state, action) => {
      if (action.payload) {
        state.user.userName = action.payload;
        return state;
      } else {
        console.log('userSlice의 changeUser에서 error 발생');
      }
    }
  }
});

export const { getUser, changeUser } = userSlice.actions;
export default userSlice.reducer;
