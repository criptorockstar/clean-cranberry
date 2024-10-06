import { useAxiosInstance } from "../axiosConfig";

const axios = useAxiosInstance();

// GET ALL CATEGORIES
export const getAllCategoriesService = async () => {
  const response = await axios.get(`/categories`);
  return response.data;
};

// GET CATEGORY BY SLUG
export const getCategoryService = async (slug: string) => {
  const response = await axios.get(`/categories/slug/${slug}`);
  return response.data;
};

// GET PAGINATED CATEGORIES WITH SEARCH AND SORTING
export const getPaginatedCategoriesService = async (
  page: number,
  limit: number,
  name?: string,
) => {
  const response = await axios.get("/categories/paginated", {
    params: { page, limit, name },
  });
  return response.data;
};
