import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

interface CategoryState {
  categories: Category[];
  totalPages: number;
  currentPage: number;
}

const initialState: CategoryState = {
  categories: [],
  totalPages: 0,
  currentPage: 1,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(
      state,
      action: PayloadAction<{
        categories: Category[];
        totalPages: number;
        currentPage: number;
      }>,
    ) {
      state.categories = action.payload.categories;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    addCategory(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload);
    },
    deleteCategory(state, action: PayloadAction<number>) {
      state.categories = state.categories.filter(
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
      }
    },
  },
});

export const selectCategoryBySlug = (state: RootState, slug: string) =>
  state.categories.categories.find(
    (category: Category) => category.slug === slug,
  );

export const selectTotalPages = (state: RootState) =>
  state.categories.totalPages;
export const selectCurrentPage = (state: RootState) =>
  state.categories.currentPage;

export const { setCategories, addCategory, deleteCategory, updateCategory } =
  categorySlice.actions;

export const categoryReducer = categorySlice.reducer;
