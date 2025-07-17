"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/services/auth_service';
import { LoginRequest } from '@/lib/api/endpoints';
import { AuthContextType } from '@/types/auth';
import { User } from '@/types/user';
import { RoleEnum, Role } from '@/types/role';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { jwtDecode } from "jwt-decode";
import { ROLE_REDIRECTS } from '@/lib/auth/route-config';

// Crear el Contexto con un valor inicial undefined para detectar si se usa fuera del Provider.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Crear el Proveedor del Contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Inicia en true para verificar el token inicial
  const router = useRouter();

  // Efecto para verificar el token en cookies al cargar la app
  useEffect(() => {
    const storedToken = getCookie('authToken');
    if (storedToken) {
      setToken(storedToken as string);
      // Decodifica el JWT para repoblar el usuario
      const decoded: any = jwtDecode(storedToken as string);
      const role = decoded.role.replace("ROLE_", "") as RoleEnum;
      setUser({
        id: decoded.sub,
        email: decoded.sub,
        name: "",
        role: { id: 0, role },
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
      });
    }
    setIsLoading(false);
  }, []);

  // Función de Login
  const login = async (credentials: LoginRequest) => {
    const { token } = await authService.login(credentials);
    setCookie('authToken', token, { path: '/' });
    setToken(token);
    // Decodifica el JWT para obtener los datos del usuario
    const decoded: any = jwtDecode(token);
    const role = decoded.role.replace("ROLE_", "") as RoleEnum;
    setUser({
        id: decoded.sub,
        email: decoded.sub,
        name: "",
        role: { id: 0, role },
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
    });
    // Redirigir según el rol
    router.push(ROLE_REDIRECTS[role] || '/dashboard');
  };

  // Función de Logout
  const logout = () => {
    deleteCookie('authToken', { path: '/' });
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const authContextValue: AuthContextType = {
    isAuthenticated: !!token,
    user,
    token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};