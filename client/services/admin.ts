import { createAxiosInstance } from "../axiosConfig";

const axios = createAxiosInstance();

// CREATE CATEGORY
export const createCategory = async (name: string, image: string) => {
  const data = {
    name,
    image,
  };

  const response = await axios.post("/categories", data);
  return response.data;
};

// DELETE CATEGORY
export const deleteCategory = async (id: number) => {
  const response = await axios.delete(`/categories/${id}`);
  return response.data;
};

// UPDATE CATEGORY
export const updateCategory = async (id: number, data: any) => {
  const response = await axios.put(`/categories/${id}`, data);
  return response.data;
};

// UPLOAD IMAGE
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
