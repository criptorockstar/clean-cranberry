import { createAxiosInstance } from "../axiosConfig";

const axios = createAxiosInstance();

// SET SHIPPING
export const setShippingService = async (data: any) => {
  const response = await axios.post(`/users/shipping`, data);
  return response.data;
};

// GET SHIPPING
export const getShippingService = async () => {
  const response = await axios.get(`/users/shipping/`);
  return response.data;
};

// SET ORDER
export const setOrderService = async () => {
  const response = await axios.post(`/orders`, {});
  return response.data;
};

// GET ORDER
export const getOrderService = async () => {
  const response = await axios.get(`/orders`);
  return response.data;
};

// GET PAGINATED ORDER WITH SEARCH
export const getPaginatedOrderService = async (
  page: number,
  limit: number,
  order?: string,
) => {
  const response = await axios.get("/orders/paginated", {
    params: { page, limit, order },
  });
  return response.data;
};

// UPDATE ORDER
export const updateOrderService = async (id: number, data: any) => {
  const response = await axios.put(`/orders/update/${id}`, data);
  return response.data;
};
