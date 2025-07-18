'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/services/auth_service';
import { LoginRequest } from '@/lib/api/endpoints';
import { AuthContextType } from '@/types/auth';
import { User } from '@/types/user';
import { RoleEnum } from '@/types/role';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  [key: string]: unknown;
};

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
      const decoded = jwtDecode(storedToken as string) as JwtPayload;
      const role = decoded.role.replace('ROLE_', '') as RoleEnum;
      setUser({
        id: parseInt(decoded.sub, 10),
        email: decoded.email,
        name: '',
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
    try {
      const { token } = await authService.login(credentials);
      setCookie('authToken', token, { path: '/' });
      setToken(token);
      // Decodifica el JWT para obtener los datos del usuario
      const decoded = jwtDecode(token) as JwtPayload;
      const role = decoded.role.replace('ROLE_', '') as RoleEnum;
      setUser({
        id: parseInt(decoded.sub, 10),
        email: decoded.email,
        name: '',
        role: { id: 0, role },
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
      });
      // Redirigir a la página principal en lugar del dashboard
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error al iniciar sesión:', err.message);
      }
    }
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

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
