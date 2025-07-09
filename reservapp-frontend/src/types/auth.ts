import { User } from "./user";
import { LoginRequest } from "@/lib/api/endpoints";

// Tipos para el payload del token JWT que esperas del backend.
export interface JwtPayload {
  sub: string; // Subject (usualmente el email o ID del usuario)
  roles: string[];
  iat: number; // Issued at
  exp: number; // Expiration time
}

// El tipo de datos que tendrá nuestro contexto de autenticación.
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}