import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";

export interface UserData {
    username: string;
    role: string;
    accessToken: string;
    accessTokenExp: number;
    refreshToken: string;
    refreshTokenExp: number;
}

type UserState = {
    user: UserData | null;
}

const initialState: UserState = {
    user: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserData>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    }
});

export const selectUser = (state: RootState) => state.user.user;

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
