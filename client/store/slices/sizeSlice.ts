import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISize {
  id: number;
  name: string;
}

export interface ISizeState {
  sizes: ISize[];
}

const initialState: ISizeState = {
  sizes: [],
};

export const sizeSlice = createSlice({
  name: "sizes",
  initialState,
  reducers: {
    setSizes: (state, action: PayloadAction<ISize[]>) => {
      state.sizes = action.payload;
    },
  },
});

export const { setSizes } = sizeSlice.actions;
export const sizeReducer = sizeSlice.reducer;
