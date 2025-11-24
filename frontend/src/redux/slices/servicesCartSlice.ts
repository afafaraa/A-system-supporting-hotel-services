import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store.ts';
import {ServiceDetailsResponse} from "../../types/service_type_attributes.ts";

export type ServiceCartItem = {
  id: string;
  attributes?: ServiceDetailsResponse;
  specialRequests: string | null;
  customPrice?: number;
};

interface ServicesCartState {
  items: Array<ServiceCartItem>;
  username: string | null;
}

const initialState: ServicesCartState = {
  items: [],
  username: null,
};

const compareItems = (item1: ServiceCartItem, item2: ServiceCartItem): boolean => {
  return (item1.specialRequests === item2.specialRequests)
}

const getStorageKey = (username: string | null) => {
  return username ? `SERVICES_CART_${username}` : 'SERVICES_CART';
}

const servicesCartSlice = createSlice({
  name: 'servicesCart',
  initialState,
  reducers: {
    setUsernameAndInitializeServicesCart: (state, action: PayloadAction<ServicesCartState["username"]>) => {
      state.username = action.payload;
      const storageKey = getStorageKey(state.username);
      try {
        const storedCart = localStorage.getItem(storageKey);
        state.items = storedCart ? JSON.parse(storedCart) : [];
      } catch (error) {
        console.error("Error parsing services cart from localStorage:", error);
        localStorage.removeItem(storageKey);
      }
    },
    addService: (state, action: PayloadAction<ServiceCartItem>) => {
      const duplicateIndex = state.items.findIndex((item) => item.id === action.payload.id);
      if (duplicateIndex === -1) state.items.push(action.payload);
      else if (!compareItems(state.items[duplicateIndex], action.payload)) state.items[duplicateIndex] = action.payload;
      const storageKey = getStorageKey(state.username);
      localStorage.setItem(storageKey, JSON.stringify(state.items));
    },
    setServices: (state, action: PayloadAction<Array<ServiceCartItem>>) => {
      state.items = action.payload;
      const storageKey = getStorageKey(state.username);
      localStorage.setItem(storageKey, JSON.stringify(state.items));
    },
    removeService: (state, action: PayloadAction<{id: ServiceCartItem["id"]}>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      const storageKey = getStorageKey(state.username);
      localStorage.setItem(storageKey, JSON.stringify(state.items));
    },
    clearServicesCart: (state) => {
      state.items = [];
      const storageKey = getStorageKey(state.username);
      localStorage.removeItem(storageKey);
    },
  },
});

export const selectServicesCart = (state: RootState) => state.servicesCart.items;
export const selectServicesCartCount = (state: RootState) => state.servicesCart.items.length;

export const { setUsernameAndInitializeServicesCart, addService, setServices, removeService, clearServicesCart } = servicesCartSlice.actions;

export default servicesCartSlice.reducer;

