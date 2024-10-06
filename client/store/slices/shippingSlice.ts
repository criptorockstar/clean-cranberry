import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IShippingState {
  id?: number;
  address: string;
  door: string | null;
  zip: string;
  phone: string;
}

const initialState: IShippingState = {
  id: undefined,
  address: "",
  door: null,
  zip: "",
  phone: "",
};

export const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    setShipping: (state, action: PayloadAction<Partial<IShippingState>>) => {
      return { ...state, ...action.payload };
    },
    clearShipping: (state) => {
      state.id = undefined;
      state.address = "";
      state.door = null;
      state.zip = "";
      state.phone = "";
    },
  },
});

export const { setShipping, clearShipping } = shippingSlice.actions;
export const shippingReducer = shippingSlice.reducer;
