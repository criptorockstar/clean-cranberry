import { useAxiosInstance } from "../axiosConfig";

const axios = useAxiosInstance();

// GET PRODUCT BY SLUG
export const getProductService = async (slug: string) => {
  const response = await axios.get(`/products/slug/${slug}`);
  return response.data;
};

// GET PAGINATED PRODUCTS WITH SEARCH
export const getPaginatedProductsService = async (
  page: number,
  limit: number,
  name?: string,
) => {
  const response = await axios.get("/products/paginated", {
    params: { page, limit, name },
  });
  return response.data;
};

// GET PAGINATED PRODUCTS WITH FILTERS
export const getFilteredProductsService = async (
  page: number,
  limit: number,
  sizes?: string,
  colors?: string,
  categories?: string,
  minPrice?: number,
  maxPrice?: number,
) => {
  const response = await axios.get("/products/filtered", {
    params: { page, limit, sizes, colors, categories, minPrice, maxPrice },
  });
  return response.data;
};

// GET MAX PRICE
export const getMaxPriceService = async () => {
  const response = await axios.get("/products/max-price");
  return response.data;
};

// GET RELATED PRODUCTS
export const getRelatedService = async (categories: string) => {
  const response = await axios.get("/products/related", {
    params: { categories },
  });
  return response.data;
};

// GET FEATURED SERVICE
export const getFeaturedService = async () => {
  const response = await axios.get("products/featured");
  return response.data;
};
