import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.ts";
import userDetailsReducer from "./slices/userDetailsSlice.ts";
import notificationsCountReducer from "./slices/notificationsCount.ts";
import servicesCartReducer from './slices/servicesCartSlice.ts';
import reservationsCartReducer from './slices/reservationsCartSlice.ts';

export const store = configureStore({
  reducer: {
    user: userReducer,
    userDetails: userDetailsReducer,
    notificationsCount: notificationsCountReducer,
    servicesCart: servicesCartReducer,
    reservationsCart: reservationsCartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
