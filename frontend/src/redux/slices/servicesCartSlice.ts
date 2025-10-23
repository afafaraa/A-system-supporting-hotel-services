import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';
import {ServiceDetailsResponse} from "../../types/service_type_attributes.ts";

export type ServiceCartItem = {
  id: string;
  attributes: ServiceDetailsResponse;
};

interface ServicesCartState {
  items: Array<ServiceCartItem>;
}

const initialState: ServicesCartState = {
  items: [],
};

const servicesCartSlice = createSlice({
  name: 'servicesCart',
  initialState,
  reducers: {
    addService: (state, action: PayloadAction<ServiceCartItem>) => {
      const isDuplicate = state.items.some((item) => item.id === action.payload.id);

      if (!isDuplicate) {
        state.items.push(action.payload);
        localStorage.setItem('SERVICES_CART', JSON.stringify(state.items));
      }
    },
    setServices: (state, action: PayloadAction<Array<ServiceCartItem>>) => {
      state.items = action.payload;
      localStorage.setItem('SERVICES_CART', JSON.stringify(state.items));
    },
    removeService: (state, action: PayloadAction<ServiceCartItem>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      localStorage.setItem('SERVICES_CART', JSON.stringify(state.items));
    },
    clearServicesCart: (state) => {
      state.items = [];
      localStorage.removeItem('SERVICES_CART');
    },
  },
});

export const selectServicesCart = (state: RootState) => state.servicesCart.items;
export const selectServicesCartCount = (state: RootState) => state.servicesCart.items.length;

export const { addService, setServices, removeService, clearServicesCart } = servicesCartSlice.actions;

export default servicesCartSlice.reducer;

