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
  username: string | null;
}

const initialState: ReservationsCartState = {
  items: [],
  username: null,
};

const getStorageKey = (username: string | null) => {
  return username ? `RESERVATIONS_CART_${username}` : 'RESERVATIONS_CART';
}

const reservationsCartSlice = createSlice({
  name: 'reservationsCart',
  initialState,
  reducers: {
    setUsernameAndInitializeReservationsCart: (state, action: PayloadAction<ReservationsCartState["username"]>) => {
      state.username = action.payload;
      const storageKey = getStorageKey(state.username);
      try {
        const reservationsCart = localStorage.getItem(storageKey);
        state.items = reservationsCart ? JSON.parse(reservationsCart) : [];
      } catch (error) {
        console.log("Error parsing reservations cart from localStorage:", error);
        localStorage.removeItem(storageKey);
      }
    },
    addReservation: (state, action: PayloadAction<ReservationCartItem>) => {
      const isDuplicate = state.items.some(
        (item) =>
          item.id === action.payload.id &&
          item.checkIn === action.payload.checkIn &&
          item.checkOut === action.payload.checkOut
      );

      if (!isDuplicate) {
        state.items.push(action.payload);
        const storageKey = getStorageKey(state.username);
        localStorage.setItem(storageKey, JSON.stringify(state.items));
      }
    },
    setReservations: (state, action: PayloadAction<Array<ReservationCartItem>>) => {
      state.items = action.payload;
      const storageKey = getStorageKey(state.username);
      localStorage.setItem(storageKey, JSON.stringify(state.items));
    },
    removeReservation: (state, action: PayloadAction<ReservationCartItem>) => {
      state.items = state.items.filter((item) => {
        const sameRoom = item.id === action.payload.id;
        const sameDates =
          item.checkIn === action.payload.checkIn &&
          item.checkOut === action.payload.checkOut;
        return !(sameRoom && sameDates);
      });
      const storageKey = getStorageKey(state.username);
      localStorage.setItem(storageKey, JSON.stringify(state.items));
    },
    clearReservationsCart: (state) => {
      state.items = [];
      const storageKey = getStorageKey(state.username);
      localStorage.removeItem(storageKey);
    },
  },
});

export const selectReservationsCart = (state: RootState) => state.reservationsCart.items;
export const selectReservationsCartCount = (state: RootState) => state.reservationsCart.items.length;

export const { setUsernameAndInitializeReservationsCart, addReservation, setReservations, removeReservation, clearReservationsCart } = reservationsCartSlice.actions;

export default reservationsCartSlice.reducer;

