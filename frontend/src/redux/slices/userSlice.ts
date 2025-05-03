import {createSlice} from "@reduxjs/toolkit";

export type UserState = {
    user: {
        username: string;
        isAuthorized: boolean;
        role: string;
    }
}

const initialState: UserState = {
    user: {
        username: '',
        isAuthorized: false,
        role: '',
    }
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.user.isAuthorized = false;
            state.user.username = '';
            state.user.role = '';
        }
    }
})

export const selectUser = (state: UserState) => state.user;
export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
