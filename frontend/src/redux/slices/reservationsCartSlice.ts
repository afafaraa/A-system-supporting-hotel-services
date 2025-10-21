import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

export type ReservationCartItem = {
  id: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
};

interface ReservationsCartState {
  items: Array<ReservationCartItem>;
}

const initialState: ReservationsCartState = {
  items: [],
};

const reservationsCartSlice = createSlice({
  name: 'reservationsCart',
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<ReservationCartItem>) => {
      const isDuplicate = state.items.some(
        (item) =>
          item.id === action.payload.id &&
          item.checkIn === action.payload.checkIn &&
          item.checkOut === action.payload.checkOut
      );

      if (!isDuplicate) {
        state.items.push(action.payload);
        localStorage.setItem('RESERVATIONS_CART', JSON.stringify(state.items));
      }
    },
    setReservations: (state, action: PayloadAction<Array<ReservationCartItem>>) => {
      state.items = action.payload;
      localStorage.setItem('RESERVATIONS_CART', JSON.stringify(state.items));
    },
    removeReservation: (state, action: PayloadAction<ReservationCartItem>) => {
      state.items = state.items.filter((item) => {
        const sameRoom = item.id === action.payload.id;
        const sameDates =
          item.checkIn === action.payload.checkIn &&
          item.checkOut === action.payload.checkOut;
        return !(sameRoom && sameDates);
      });
      localStorage.setItem('RESERVATIONS_CART', JSON.stringify(state.items));
    },
    clearReservationsCart: (state) => {
      state.items = [];
      localStorage.removeItem('RESERVATIONS_CART');
    },
  },
});

export const selectReservationsCart = (state: RootState) => state.reservationsCart.items;
export const selectReservationsCartCount = (state: RootState) => state.reservationsCart.items.length;

export const { addReservation, setReservations, removeReservation, clearReservationsCart } = reservationsCartSlice.actions;

export default reservationsCartSlice.reducer;

