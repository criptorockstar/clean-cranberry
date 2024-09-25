import { createAxiosInstance } from "../axiosConfig";

const axios = createAxiosInstance();

export const signIn = async (email: string, password: string) => {
  const response = await axios.post("/users/sign-in", { email, password });
  return response.data;
};

export const signUp = async (
  username: string,
  email: string,
  password: string,
  passwordConfirm: string,
) => {
  const response = await axios.post("/users/sign-up", {
    username,
    email,
    password,
    passwordConfirm,
  });
  return response.data;
};

export const verifyToken = async () => {
  const response = await axios.get("/users/verify-token");
  return response.data;
};

export const passwordRecovery = async (email: string) => {
  const response = await axios.post("/users/password-recovery", { email });
  return response.data;
};

export const passwordReset = async (
  password: string,
  password_confirmation: string,
) => {
  const response = await axios.put("/users/password-reset", {
    password,
    password_confirmation,
  });
  return response.data;
};

export const updateUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const response = await axios.put("/users/update", {
    username,
    email,
    password,
  });
  return response.data;
};

export const deleteAccount = async () => {
  const response = await axios.delete("/users/delete-account");
  return response.data;
};

// ## ADMIN ## //
export const getAllUsers = async (page: number = 1, limit: number = 10) => {
  const response = await axios.get(`/users/all`, {
    params: { page, limit },
  });
  return response.data;
};
