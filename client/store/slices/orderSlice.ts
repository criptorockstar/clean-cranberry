import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  id: number;
  username: string;
  email: string;
  reset_password_token: string | null;
  roles: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  id: number;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    id: number;
    address: string;
    door: string | null;
    zip: string;
    phone: string;
  };
  items: Array<{}>;
  user: IUser;
}

export interface IOrderState {
  orders: IOrder[];
  total: number;
  page: number;
  limit: number;
}

const initialState: IOrderState = {
  orders: [],
  total: 0,
  page: 1,
  limit: 10,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (
      state,
      action: PayloadAction<{
        orders: IOrder[];
        total: number;
        page: number;
        limit: number;
      }>,
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
    },
    setOrder: (state, action: PayloadAction<IOrder>) => {
      const orderIndex = state.orders.findIndex(
        (order) => order.orderNumber === action.payload.orderNumber,
      );
      if (orderIndex >= 0) {
        state.orders[orderIndex] = action.payload;
      } else {
        state.orders.push(action.payload);
      }
    },
    setOrderStatus: (
      state,
      action: PayloadAction<{ id: number; status: string }>,
    ) => {
      const orderIndex = state.orders.findIndex(
        (order) => order.id === action.payload.id,
      );
      if (orderIndex >= 0) {
        state.orders[orderIndex].status = action.payload.status;
      }
    },
    cleanOrders: (state) => {
      state.orders = [];
      state.total = 0;
      state.page = 1;
      state.limit = 10;
    },
  },
});

export const selectOrderByNumber = (state: IOrderState, orderNumber: string) =>
  state.orders.find((order) => order.orderNumber === orderNumber);

export const { setOrders, setOrder, cleanOrders, setOrderStatus } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
