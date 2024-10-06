import { useAxiosInstance } from "../axiosConfig";

const axios = useAxiosInstance();

// GET ALL SIZES
export const getAllSizeService = async () => {
  const response = await axios.get(`/products/sizes`);
  return response.data;
};
