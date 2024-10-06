import { useState } from "react";
import { useAppDispatch } from "@/store/store";
import { deleteCategory as deleteCategoryAction } from "@/store/slices/categorySlice";
import { deleteProduct as deleteProductAction } from "@/store/slices/productSlice";
import {
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
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
  const updateCategory = async (id: number, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateCategoryService(id, data);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // CREATE PRODUCT
  const createProduct = async (
    name: string,
    description: string,
    quantity: string,
    stock: number,
    images: string[],
    price: number,
    offer: number,
    colors: string[],
    sizes: string[],
    categories: string[],
    featured: boolean,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createProductService(
        name,
        description,
        quantity,
        stock,
        images,
        price,
        offer,
        colors,
        sizes,
        categories,
        featured,
      );
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE PRODUCT
  const updateProduct = async (id: number, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateProductService(id, data);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteProductService(id);
      dispatch(deleteProductAction(id));
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
    updateCategory,
    deleteCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  };
};

export default useAdmin;
