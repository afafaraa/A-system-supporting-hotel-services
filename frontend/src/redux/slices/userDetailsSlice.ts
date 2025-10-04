import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";

export interface UserDetails {
  email: string,
  employeeData: EmployeeData | null,
  guestData: GuestData | null,
  name: string,
  surname: string,
}

interface EmployeeData {
  department: string,
  sectors: string[],
  hireDate: string | Date,
}

interface GuestData {
  roomNumber: string,
  checkInDate: string,
  checkOutDate: string,
  bill: number,
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
