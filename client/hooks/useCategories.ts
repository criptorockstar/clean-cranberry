import { useState } from "react";
import { getCategoriesService } from "@/services/categories";

const useCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // GET CATEGORIES
  const fetchCategories = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategoriesService(page, limit);
      setCategories(response.data);

      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchCategories,
    categories,
    loading,
    error,
  };
};

export default useCategory;
