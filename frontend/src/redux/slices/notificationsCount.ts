import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";

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
export const selectNotificationsCount = (state: RootState) => state.notificationsCount.count;
export default notificationsCount.reducer;
