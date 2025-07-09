"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/services/auth_service';
import { LoginRequest } from '@/lib/api/endpoints';
import { AuthContextType } from '@/types/auth';
import { User } from '@/types/user';
import { RoleEnum, Role } from '@/types/role';

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

  // Efecto para verificar el token en localStorage al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('jwtToken');
      if (storedToken) {
        try {
            setToken(storedToken);
        } catch (error) {
          console.error("Token inválido o expirado. Limpiando...", error);
          localStorage.removeItem('jwtToken');
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  // Función de Login
  const login = async (credentials: LoginRequest) => {
    const { token, user } = await authService.login(credentials);
    localStorage.setItem('jwtToken', token);
    setToken(token);
    // Adaptar el objeto user para que tenga todas las propiedades requeridas por el tipo User
    setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        role: { id: 0, role: user.role as RoleEnum },
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
    });
    // Redirigir según el rol del usuario
    router.push('/dashboard'); 
  };

  // Función de Logout
  const logout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
    setUser(null);
    router.push('/auth/login');
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