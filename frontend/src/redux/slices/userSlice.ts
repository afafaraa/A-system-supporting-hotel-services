import {createSlice} from "@reduxjs/toolkit";

type UserState = {
    username: string;
    isAuthenticated: boolean;
    role: string;
}

const initialState: UserState = {
    username: '',
    isAuthenticated: false,
    role: '',
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: { payload: { username?: string, isAuthenticated?: boolean, role?: string } }) => {
            return {
                ...state,
                ...action.payload
            }
        },
        clearUser: () => initialState
    }
});

export const selectUser = (state: { user: UserState }) => state.user;

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
