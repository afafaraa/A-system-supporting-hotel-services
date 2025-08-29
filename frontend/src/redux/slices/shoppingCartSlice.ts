import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";

const initialState: { shoppingCart: Array<string> } = {
  shoppingCart: [],
};

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.shoppingCart.push(action.payload);
      localStorage.setItem('SHOPPING_CART', JSON.stringify(state.shoppingCart));
    },
    setItems: (state, action) => {
      state.shoppingCart = action.payload;
      localStorage.setItem('SHOPPING_CART', JSON.stringify(state.shoppingCart));
    },
    removeItem: (state, action) => {
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
