import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCategories } from "../slices/categorySlice";
import useCategory from "@/hooks/useCategories";

const useFetchCategories = (page: number = 1, limit: number = 10) => {
  const dispatch = useDispatch();
  const { fetchCategories, categories, loading, error } = useCategory();

  // Ref para controlar si las categorías ya fueron cargadas
  const hasFetched = useRef(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories(page, limit);
        dispatch(
          setCategories({
            categories: response.data,
            currentPage: page,
            totalPages: response.totalPages,
          }),
        );
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    // Verifica si ya se han cargado las categorías
    if (!hasFetched.current) {
      loadCategories();
      hasFetched.current = true; // Marca que las categorías han sido cargadas
    }
  }, [dispatch, fetchCategories, page, limit]);

  return { categories, loading, error };
};

export default useFetchCategories;
