import { createAxiosInstance } from "../axiosConfig";

const axios = createAxiosInstance();

// GET CATEGORIES
export const getCategoriesService = async (
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axios.get("/categories", {
    params: { page, limit },
  });

  return response.data;
};

// SEARCH CATEGORY BY NAME
export const searchCategoryService = async (name: string) => {
  const response = await axios.get("/categories/search", {
    params: { name },
  });
  return response.data;
};
