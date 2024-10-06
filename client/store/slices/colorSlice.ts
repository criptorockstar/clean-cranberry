import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IColor {
  id: number;
  name: string;
  code: string;
}

export interface IColorState {
  colors: IColor[];
}

const initialState: IColorState = {
  colors: [],
};

export const colorSlice = createSlice({
  name: "colors",
  initialState,
  reducers: {
    setColors: (state, action: PayloadAction<IColor[]>) => {
      state.colors = action.payload;
    },
  },
});

export const { setColors } = colorSlice.actions;
export const colorReducer = colorSlice.reducer;
