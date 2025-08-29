import {createSlice} from "@reduxjs/toolkit";

const notificationsCount = createSlice({
  name: "notificationsCount",
  initialState: { count: 0 },
  reducers: {
    setNotificationsCount: (state, action) => {
      state.count = action.payload;
    },
  },
});

export const { setNotificationsCount } = notificationsCount.actions;
export default notificationsCount.reducer;
