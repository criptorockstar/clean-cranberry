import { createAxiosInstance } from "../axiosConfig";

const axios = createAxiosInstance();

// ADD CART ITEMS
export const addCartService = async (
  product: number,
  quantity: number,
  size: number,
  color: number,
) => {
  const data = {
    product,
    quantity,
    size,
    color,
  };

  const response = await axios.post("/cart/add", data);
  return response.data;
};

// GET CART
export const getCartService = async () => {
  const response = await axios.get("/cart");
  return response.data;
};

// GET ITEM COUNT
export const getCartCountService = async () => {
  const response = await axios.get("/cart/count");
  return response.data;
};

// DECREASE ITEM QUANTITY
export const decreaseQuantityService = async (id: number) => {
  console.log(id);
  const response = await axios.put(`/cart/decrease/${id}`);
  return response.data;
};

// INCREASE ITEM QUANTITY
export const increaseQuantityService = async (id: number) => {
  const response = await axios.put(`/cart/increase/${id}`);
  return response.data;
};

// UPDATE ITEM QUANTITY
export const updateQuantityService = async (id: number, data: any) => {
  const formData = {
    quantity: data,
  };
  const response = await axios.put(`/cart/update/${id}`, formData);
  return response.data;
};

// DELETE ITEM FROM CART
export const removeItemService = async (id: number) => {
  const response = await axios.delete(`/cart/remove/${id}`);
  return response.data;
};
