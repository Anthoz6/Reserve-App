import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from "../client";
import { API_ENDPOINTS, LoginRequest, LoginResponse } from "../endpoints";


export const authService = {
    /**
     * Iniciar sesión
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
      try {
        const response = await apiRequest.post<LoginResponse>(
          API_ENDPOINTS.auth.login,
          credentials
        );
        
        // Guardar token automáticamente
        if (response.token) {
          setAuthToken(response.token);
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    },

    /** 
     * Cerrar sesión
     */

    async logout(): Promise<void>{
        removeAuthToken();
    },

    /**
     * Verificar si el usuario está autenticado
     */

    isAuthenticated(): boolean {
        return !!getAuthToken();
    },

    /**
   * Obtener información del usuario actual desde el token
   * (Esto se implementará cuando tengamos el context de auth) getCurrentUser()
   */
    

}