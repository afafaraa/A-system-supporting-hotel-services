import {createSlice} from "@reduxjs/toolkit";

const initialState = {
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

export const selectUser = (state: any) => state.user;
export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
