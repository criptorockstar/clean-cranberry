import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductService,
  getPaginatedProductsService,
  getFilteredProductsService,
  getMaxPriceService,
  getRelatedService,
  getFeaturedService,
} from "@/services/products";
import { setProducts, setRelatedProducts } from "@/store/slices/productSlice";
import { RootState } from "@/store/store";

const useProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);
  const relatedProducts = useSelector(
    (state: RootState) => state.products.relatedProducts,
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.totalPages,
  );
  const currentPage = useSelector(
    (state: RootState) => state.products.currentPage,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET PAGINATED PRODUCTS WITH SEARCH
  const getPaginatedProducts = async (
    page: number,
    limit: number,
    name?: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPaginatedProductsService(page, limit, name);
      dispatch(
        setProducts({
          products: response.products,
          relatedProducts: [],
          total: response.total,
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

  // GET PAGINATED PRODUCTS WITH FILTERS
  const getFilteredProducts = async (
    page: number,
    limit: number,
    sizes?: string,
    colors?: string,
    categories?: string,
    minPrice?: number,
    maxPrice?: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFilteredProductsService(
        page,
        limit,
        sizes,
        colors,
        categories,
        minPrice,
        maxPrice,
      );
      dispatch(
        setProducts({
          products: response.products,
          relatedProducts: [],
          total: response.total,
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

  // GET PRODUCT BY SLUG
  const getProduct = async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductService(slug);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET MAX PRICE
  const getMaxPrice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMaxPriceService();
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET RELATED PRODUCTS
  const getRelated = async (categories: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRelatedService(categories);
      dispatch(setRelatedProducts(response));
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET FEATURED PRODUCTS
  const getFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFeaturedService();
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getProduct,
    getPaginatedProducts,
    getFilteredProducts,
    getMaxPrice,
    getRelated,
    getFeatured,
    products,
    relatedProducts,
    loading,
    error,
    totalPages,
    currentPage,
  };
};

export default useProducts;
