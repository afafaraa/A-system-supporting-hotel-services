import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';

export type ShoppingCartProps = {
  id: string;
  type: 'RESERVATION' | 'SERVICE';
  // if it's a reservation, include these fields
  // todo: maybe refactor to 2 slices later
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
};

interface ShoppingCartState {
  shoppingCart: Array<ShoppingCartProps>;
}

const initialState: ShoppingCartState = {
  shoppingCart: [],
};

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ShoppingCartProps>) => {
      if (!state.shoppingCart.includes(action.payload)) {
        state.shoppingCart.push(action.payload);
        localStorage.setItem(
          'SHOPPING_CART',
          JSON.stringify(state.shoppingCart)
        );
      }
    },
    setItems: (state, action: PayloadAction<Array<ShoppingCartProps>>) => {
      state.shoppingCart = action.payload;
      localStorage.setItem('SHOPPING_CART', JSON.stringify(state.shoppingCart));
    },
    removeItem: (
      state,
      action: PayloadAction<ShoppingCartProps>
    ) => {
      state.shoppingCart = state.shoppingCart.filter((item) => {
        if (item.type === 'RESERVATION') {
            console.log(item.checkIn)
            console.log(item.checkOut)
            console.log(action.payload.checkIn)
            console.log(action.payload.checkOut)
            console.log(action.payload)
            const sameRoom = item.id === action.payload.id;
            const sameDates =
                (!item.checkIn || !action.payload.checkIn || item.checkIn === action.payload.checkIn) &&
                (!item.checkOut || !action.payload.checkOut || item.checkOut === action.payload.checkOut);
            return !(sameRoom && sameDates);
        } else {
          return item.id !== action.payload.id;
        }
      });
      console.log(state.shoppingCart)
      localStorage.setItem('SHOPPING_CART', JSON.stringify(state.shoppingCart));
    },

    clearCart: (state) => {
      state.shoppingCart = [];
      localStorage.removeItem('SHOPPING_CART');
    },
  },
});

export const selectShoppingCart = (state: RootState) =>
  state.shoppingCart.shoppingCart;
export const selectShoppingCartCount = (state: RootState) =>
  state.shoppingCart.shoppingCart.length;

export const { addItem, setItems, removeItem, clearCart } =
  shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
