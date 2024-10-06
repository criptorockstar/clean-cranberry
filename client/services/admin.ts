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

// UPLOAD IMAGE
export const uploadCategoryImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post("/files/upload-category", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// DELETE IMAGE
export const deleteImage = async (fileName: string) => {
  const response = await axios.delete(`/files/delete/${fileName}`);
  return response.data;
};

// CREATE PRODUCT
export const createProduct = async (
  name: string,
  description: string,
  quantity: string,
  stock: number,
  images: string[],
  price: number,
  offer: number,
  colors: string[],
  sizes: string[],
  categories: string[],
  featured: boolean,
) => {
  const response = await axios.post(`/products`, {
    name,
    description,
    quantity,
    stock,
    images,
    price,
    offer,
    colors,
    sizes,
    categories,
    featured,
  });
  return response.data;
};

// UPDATE PRODUCT
export const updateProduct = async (id: number, data: any) => {
  const response = await axios.put(`/products/${id}`, data);
  return response.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id: number) => {
  const response = await axios.delete(`/products/${id}`);
  return response.data;
};
