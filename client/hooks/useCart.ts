import { useState } from "react";
import { useAppDispatch } from "@/store/store";
import {
  addCartService,
  getCartService,
  getCartCountService,
  decreaseQuantityService,
  increaseQuantityService,
  updateQuantityService,
  removeItemService,
} from "@/services/cart";
import { setItemCount, setCart } from "@/store/slices/cartSlice";

const useCart = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ADD CART ITEMS
  const addCart = async (
    product: number,
    quantity: number,
    size: number,
    color: number,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await addCartService(product, quantity, size, color);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET CART
  const getCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCartService();
      dispatch(setCart(response));
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET ITEM COUNT
  const getCount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCartCountService();
      dispatch(setItemCount(response));
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DECRESE ITEM QUANTITY
  const decreaseQuantity = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await decreaseQuantityService(id);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // INCREASE ITEM QUANTITY
  const increaseQuantity = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await increaseQuantityService(id);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE QUANTITY
  const updateQuantity = async (id: number, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateQuantityService(id, data);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // REMOVE CART ITEM
  const removeItem = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await removeItemService(id);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addCart,
    getCart,
    getCount,
    decreaseQuantity,
    increaseQuantity,
    updateQuantity,
    removeItem,
    loading,
    error,
  };
};

export default useCart;
