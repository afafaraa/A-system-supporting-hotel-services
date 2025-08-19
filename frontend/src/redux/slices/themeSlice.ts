import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";

const initialState = {
  theme: 'light',
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      if (state.theme !== action.payload) {
        localStorage.setItem('THEME', action.payload);
      }
      state.theme = action.payload;
    },
  }
});

export const selectTheme = (state: RootState) => state.theme;

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
