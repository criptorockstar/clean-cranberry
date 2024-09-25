import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
  username?: string;
  email?: string;
  role?: string;
  users?: Array<{ email: string; role: string }>;
  currentPage?: number;
  totalPages?: number;
}

const initialState: IUserState = {
  username: undefined,
  email: undefined,
  role: undefined,
  users: [],
  currentPage: 1,
  totalPages: 1,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<IUserState>>) => {
      return { ...state, ...action.payload };
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setUsers: (
      state,
      action: PayloadAction<Array<{ email: string; role: string }>>,
    ) => {
      state.users = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    clearUser: (state) => {
      state.username = undefined;
      state.email = undefined;
      state.role = undefined;
      state.users = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
});

export const {
  setUser,
  setEmail,
  setUsers,
  setCurrentPage,
  setTotalPages,
  clearUser,
} = userSlice.actions;
export const userReducer = userSlice.reducer;
