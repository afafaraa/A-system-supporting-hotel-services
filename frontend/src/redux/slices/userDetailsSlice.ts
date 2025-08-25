import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";

export interface UserDetails {
  email: string,
  employeeData: object,
  guestData: GuestData | null,
  name: string,
  surname: string,
}

interface GuestData {
  roomNumber: string,
  checkInDate: string,
  checkOutDate: string,
  orders: object[],
}

const initialState: {userDetails: UserDetails | null} = {
  userDetails: null
}

const userDetailsSlice = createSlice({
  name: "user_details",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserDetails>) => {
      state.userDetails = action.payload;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
    }
  }
});

export const selectUserDetails = (state: RootState) => state.userDetails.userDetails;

export const { setUserDetails, clearUserDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
