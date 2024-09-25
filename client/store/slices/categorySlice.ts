import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

interface CategoryState {
  categories: [];
  filteredCategory: Category | null;
  allCategories: Category[];
  currentPage: number;
  totalPages: number;
}

const initialState: CategoryState = {
  categories: [],
  filteredCategory: null,
  allCategories: [],
  currentPage: 1,
  totalPages: 1,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(
      state,
      action: PayloadAction<{
        categories: Category[];
        currentPage: number;
        totalPages: number;
      }>,
    ) {
      state.categories = action.payload.categories;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },
    setFilteredCategory(state, action: PayloadAction<Category | null>) {
      state.filteredCategory = action.payload;
    },
    addCategory(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload);
      state.allCategories.push(action.payload);
    },
    deleteCategory(state, action: PayloadAction<number>) {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      );
      state.allCategories = state.allCategories.filter(
        (category) => category.id !== action.payload,
      );
    },
    updateCategory(
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        image: string;
        slug: string;
      }>,
    ) {
      const categoryIndex = state.categories.findIndex(
        (category) => category.id === action.payload.id,
      );
      if (categoryIndex >= 0) {
        state.categories[categoryIndex].name = action.payload.name;
        state.categories[categoryIndex].image = action.payload.image;
        state.categories[categoryIndex].slug = action.payload.slug;

        const allCategoryIndex = state.allCategories.findIndex(
          (category) => category.id === action.payload.id,
        );
        if (allCategoryIndex >= 0) {
          state.allCategories[allCategoryIndex].name = action.payload.name;
          state.allCategories[allCategoryIndex].image = action.payload.image;
          state.allCategories[allCategoryIndex].slug = action.payload.slug;
        }
      }
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
  },
});

export const {
  setCategories,
  setFilteredCategory,
  addCategory,
  deleteCategory,
  updateCategory,
  setPage,
  setTotalPages,
} = categorySlice.actions;

export const categoryReducer = categorySlice.reducer;
