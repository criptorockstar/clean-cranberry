import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICategory {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface IColor {
  id: number;
  name: string;
  code: string;
}

interface ISize {
  id: number;
  name: string;
}

interface IImage {
  id: number;
  url: string;
}

interface IProduct {
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
  categories: ICategory[];
  colors: IColor[];
  sizes: ISize[];
  images: IImage[];
}

interface IProductState {
  products: IProduct[];
  relatedProducts: IProduct[];
  total: number;
  totalPages: number;
  currentPage: number;
}

const initialState: IProductState = {
  products: [],
  relatedProducts: [],
  total: 0,
  totalPages: 0,
  currentPage: 1,
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProductState>) => {
      state.products = action.payload.products;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    addProduct: (state, action: PayloadAction<IProduct>) => {
      state.products.push(action.payload);
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      );
    },
    updateProduct: (state, action: PayloadAction<IProduct>) => {
      const productIndex = state.products.findIndex(
        (product) => product.id === action.payload.id,
      );
      if (productIndex >= 0) {
        state.products[productIndex] = action.payload;
      }
    },
    cleanProduct: (state) => {
      state.products = [];
      state.relatedProducts = [];
      state.total = 0;
      state.totalPages = 0;
      state.currentPage = 1;
    },
    setRelatedProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.relatedProducts = action.payload;
    },
    setProductBySlug: (state, action: PayloadAction<IProduct | null>) => {
      const existingProductIndex = state.products.findIndex(
        (product) => product.slug === action.payload?.slug,
      );
      if (existingProductIndex >= 0) {
        state.products[existingProductIndex] = action.payload as IProduct;
      }
    },
  },
});

export const selectProductBySlug = (state: IProductState, slug: string) =>
  state.products.find((product: IProduct) => product.slug === slug);

export const selectTotalPages = (state: IProductState) => state.totalPages;
export const selectCurrentPage = (state: IProductState) => state.currentPage;

export const {
  setProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  setProductBySlug,
  setRelatedProducts,
  cleanProduct,
} = productSlice.actions;

export const productReducer = productSlice.reducer;
