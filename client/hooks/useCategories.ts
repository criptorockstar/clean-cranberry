import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategoriesService,
  getCategoryService,
  getPaginatedCategoriesService,
} from "@/services/categories";
import { setCategories } from "@/store/slices/categorySlice";
import { RootState } from "@/store/store";

const useCategories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const totalPages = useSelector(
    (state: RootState) => state.categories.totalPages,
  );
  const currentPage = useSelector(
    (state: RootState) => state.categories.currentPage,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET ALL CATEGORIES
  const getAllCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllCategoriesService();
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET PAGINATED CATEGORIES WITH SEARCH AND SORTING
  const getPaginatedCategories = async (
    page: number,
    limit: number,
    name?: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPaginatedCategoriesService(page, limit, name);
      dispatch(
        setCategories({
          categories: response.categories,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        }),
      );
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET CATEGORY BY SLUG
  const getCategory = async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategoryService(slug);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getCategory,
    getAllCategories,
    getPaginatedCategories,
    categories,
    loading,
    error,
    totalPages,
    currentPage,
  };
};

export default useCategories;
