import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";

interface ShoppingCartState {
  shoppingCart: Array<string>
}

const initialState: ShoppingCartState = {
  shoppingCart: [],
};

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      if (!state.shoppingCart.includes(action.payload)) {
        state.shoppingCart.push(action.payload);
        localStorage.setItem('SHOPPING_CART', JSON.stringify(state.shoppingCart));
      }
    },
    setItems: (state, action: PayloadAction<Array<string>>) => {
      state.shoppingCart = action.payload;
      localStorage.setItem('SHOPPING_CART', JSON.stringify(state.shoppingCart));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.shoppingCart = state.shoppingCart.filter(item => item !== action.payload);
      localStorage.setItem('SHOPPING_CART', JSON.stringify(state.shoppingCart));
    },
    clearCart: (state) => {
      state.shoppingCart = [];
      localStorage.removeItem('SHOPPING_CART');
    },
  },
});

export const selectShoppingCart = (state: RootState) => state.shoppingCart.shoppingCart;
export const selectShoppingCartCount = (state: RootState) => state.shoppingCart.shoppingCart.length;

export const { addItem, setItems, removeItem, clearCart } = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
