import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

const initialState = {
    user: {
        username: '',
        isAuthorized: false,
    }
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
})

export const selectUser = (state: any) => state.user;
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
