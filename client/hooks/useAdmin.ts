import { useState } from "react";
import { useAppDispatch } from "@/store/store";
import { deleteCategory as deleteCategoryAction } from "@/store/slices/categorySlice";
import {
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
  updateCategory as updateCategoryService,
} from "@/services/admin";

const useAdmin = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CREATE CATEGORY
  const createCategory = async (name: string, image: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createCategoryService(name, image);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE CATEGORY
  const deleteCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteCategoryService(id);
      dispatch(deleteCategoryAction(id));
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE CATEGORY
  const updateCategory = async (
    id: number,
    name: string,
    slug: string,
    image?: File,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateCategoryService(id, {
        name,
        slug,
        ...(image ? { image } : {}),
      });
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCategory,
    deleteCategory,
    updateCategory,
    loading,
    error,
  };
};

export default useAdmin;
