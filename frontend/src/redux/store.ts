import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.ts";
import userDetailsReducer from "./slices/userDetailsSlice.ts";
import shoppingCartReducer from "./slices/shoppingCartSlice.ts";
import notificationsCountReducer from "./slices/notificationsCount.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userDetails: userDetailsReducer,
    shoppingCart: shoppingCartReducer,
    notificationsCount: notificationsCountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
