import { useAxiosInstance } from "../axiosConfig";

const axios = useAxiosInstance();

// GET ALL COLORS
export const getAllColorService = async () => {
  const response = await axios.get(`/products/colors`);
  return response.data;
};
