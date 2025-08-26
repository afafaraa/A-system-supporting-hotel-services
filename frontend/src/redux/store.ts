import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.ts";
import userDetailsReducer from "./slices/userDetailsSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userDetails: userDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
