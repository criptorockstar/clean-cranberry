import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getShippingService,
  setShippingService,
  setOrderService,
  getOrderService,
  getPaginatedOrderService,
  updateOrderService,
} from "@/services/order";
import { setOrders } from "@/store/slices/orderSlice";
import { RootState } from "@/store/store";

const useOrder = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders);
  const totalPages = useSelector((state: RootState) => state.orders.total);
  const currentPage = useSelector((state: RootState) => state.orders.page);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET SHIPPING
  const getShipping = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getShippingService();
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // SET SHIPPING
  const setShipping = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await setShippingService(data);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // SET ORDER
  const setOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await setOrderService();
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET ORDER
  const getOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getOrderService();
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPaginatedOrders = async (
    page: number,
    limit: number,
    order?: string,
  ) => {
    const response = await getPaginatedOrderService(page, limit, order);
    dispatch(setOrders(response));
    return response;
  };

  // UPDATE ORDER
  const updateOrder = async (id: number, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const formData = {
        status: data,
      };

      const response = await updateOrderService(id, formData);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getShipping,
    setShipping,
    setOrder,
    getOrder,
    getPaginatedOrders,
    updateOrder,
    totalPages,
    currentPage,
    orders,
    loading,
    error,
  };
};

export default useOrder;
