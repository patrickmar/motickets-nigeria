// eventSlice.js
import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    updateStatus: false,
  },
  reducers: {
    setUpdateStatus: (state, action) => {
      state.updateStatus = action.payload;
    },
  },
});

export const { setUpdateStatus } = eventSlice.actions;
export default eventSlice.reducer;
