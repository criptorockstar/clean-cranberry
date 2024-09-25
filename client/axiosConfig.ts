import axios from "axios";
import Cookies from "js-cookie";
import { clearUser } from "@/store/slices/userSlice";
import { store } from "@/store/store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.cranberrymayorista.com";

// Instancia para solicitudes autenticadas
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
  });

  // Interceptor para añadir el token de acceso
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Interceptor para manejar respuestas
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          try {
            const response = await axios.post(
              `${API_URL}/users/refresh-token`,
              {
                token: refreshToken,
              },
            );

            if (response.status === 200) {
              const { accessToken } = response.data;
              Cookies.set("accessToken", accessToken, { expires: 1 });

              // Reintentar la solicitud original
              error.config.headers["Authorization"] = `Bearer ${accessToken}`;
              return axios.request(error.config);
            }
          } catch (refreshError) {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            store.dispatch(clearUser());
          }
        } else {
          // Si no hay refreshToken, limpia el estado del usuario
          Cookies.remove("accessToken");
          store.dispatch(clearUser());
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

// Instancia para solicitudes públicas (sin autenticación)
const useAxiosInstance = () => {
  return axios.create({
    baseURL: API_URL,
  });
};

export { createAxiosInstance, useAxiosInstance };
