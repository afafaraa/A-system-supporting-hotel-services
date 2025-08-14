import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.ts";
import themeReducer from "./slices/themeSlice.ts";

export const store = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
