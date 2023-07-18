const { createSlice } = require('@reduxjs/toolkit');

const initialState = null;
const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      return (state = action.payload);
    }
  }
});

export const { setAddress } = mapSlice.actions;
export default mapSlice.reducer;
