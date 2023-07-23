const { createSlice } = require('@reduxjs/toolkit');

const initialState = null;
const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    markerAddress: (state, action) => {
      return (state = action.payload);
    }
  }
});

export const { markerAddress } = mapSlice.actions;
export default mapSlice.reducer;
