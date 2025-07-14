import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { toast } from "sonner";
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Helpers para manejo de token
const TOKEN_KEY = "authToken";

export const getAuthToken = () => {
  return getCookie(TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  setCookie(TOKEN_KEY, token, { path: '/' });
};

export const removeAuthToken = () => {
  deleteCookie(TOKEN_KEY, { path: '/' });
};

// Configuracion base de Axios
const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para request - agregar token de autenticacion
apiClient.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para responses - manejar errores globalmente y mostrar toast
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response?.status === 401) {
      toast("Sesión expirada. Por favor inicia sesión de nuevo.");
      removeAuthToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } else if (response?.status === 403) {
      toast("No tienes permisos para realizar esta acción.");
    } else if (response?.status === 404) {
      toast("Recurso no encontrado.");
    } else if (response?.status >= 500) {
      toast("Error del servidor. Inténtalo más tarde.");
    } else if (response?.data?.message) {
      toast(response.data.message);
    } else {
      toast("Ha ocurrido un error inesperado.");
    }
    return Promise.reject(error);
  }
);

// Helpers para requests
export const apiRequest = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then((response) => response.data),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post(url, data, config).then((response) => response.data),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config).then((response) => response.data),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put(url, data, config).then((response) => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then((response) => response.data),
};

export default apiClient;