import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IProductImage {
  id: number;
  url: string;
}

export interface IProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  quantity: string;
  stock: number;
  price: number;
  offer: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  images: IProductImage[];
}

export interface ICartItem {
  id: number;
  quantity: number;
  size: number;
  color: number;
  product: IProduct;
}

export interface ICart {
  items: ICartItem[];
  total: number;
}

export interface ICartState {
  cart: ICart | null;
  itemCount: number;
}

const initialState: ICartState = {
  cart: {
    items: [],
    total: 0,
  },
  itemCount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<ICart>) => {
      state.cart = action.payload;
      state.itemCount = action.payload.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
    },
    setItemCount: (state, action: PayloadAction<number>) => {
      state.itemCount = action.payload;
    },
    addItemToCart: (state, action: PayloadAction<ICartItem>) => {
      state.cart?.items.push(action.payload);
      state.cart!.total +=
        action.payload.product.price * action.payload.quantity;
      state.itemCount += action.payload.quantity;
    },
    updateCartItem: (state, action: PayloadAction<ICartItem>) => {
      const itemIndex = state.cart?.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (itemIndex !== undefined && itemIndex >= 0 && state.cart) {
        const oldItem = state.cart.items[itemIndex];
        state.cart.items[itemIndex] = action.payload;
        state.cart.total +=
          action.payload.product.price * action.payload.quantity -
          oldItem.product.price * oldItem.quantity;
        state.itemCount += action.payload.quantity - oldItem.quantity;
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemIndex = state.cart?.items.findIndex(
        (item) => item.id === action.payload,
      );
      if (itemIndex !== undefined && itemIndex >= 0 && state.cart) {
        const item = state.cart.items[itemIndex];
        state.cart.total -= item.product.price * item.quantity;
        state.itemCount -= item.quantity;
        state.cart.items.splice(itemIndex, 1);
      }
    },
    increaseItemCount: (state, action: PayloadAction<number>) => {
      const itemIndex = state.cart?.items.findIndex(
        (item) => item.id === action.payload,
      );
      if (itemIndex !== undefined && itemIndex >= 0 && state.cart) {
        const item = state.cart.items[itemIndex];
        item.quantity += 1;
        state.cart.total += item.product.price;
        state.itemCount += 1;
      }
    },
    decreaseItemCount: (state, action: PayloadAction<number>) => {
      const itemIndex = state.cart?.items.findIndex(
        (item) => item.id === action.payload,
      );
      if (itemIndex !== undefined && itemIndex >= 0 && state.cart) {
        const item = state.cart.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
          state.cart.total -= item.product.price;
          state.itemCount -= 1;
        }
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const itemIndex = state.cart?.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (itemIndex !== undefined && itemIndex >= 0 && state.cart) {
        const item = state.cart.items[itemIndex];
        const oldQuantity = item.quantity;
        const newQuantity = action.payload.quantity;

        item.quantity = newQuantity;
        state.cart.total += (newQuantity - oldQuantity) * item.product.price;
        state.itemCount += newQuantity - oldQuantity;
      }
    },
    cleanCart: (state) => {
      state.cart = {
        items: [],
        total: 0,
      };
      state.itemCount = 0;
    },
  },
});

export const {
  setCart,
  setItemCount,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  increaseItemCount,
  decreaseItemCount,
  updateQuantity,
  cleanCart, // Exportamos la nueva acción cleanCart
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
