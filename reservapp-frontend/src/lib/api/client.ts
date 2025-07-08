import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { toast } from "sonner";

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
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para responses - manejar errores globalmente
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado o no válido
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast("Sesión expirada. Por favor inicia sesión de nuevo.");
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    } else {
      // Puedes mostrar un toast genérico para otros errores
      toast(error.response?.data?.message || "Ocurrió un error inesperado");
    }
    return Promise.reject(error);
  }
);

export default apiClient;