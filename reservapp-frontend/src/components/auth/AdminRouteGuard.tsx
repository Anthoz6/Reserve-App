"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { RoleEnum } from '@/types/role';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo verificar después de que se haya cargado la información de autenticación
    if (!isLoading) {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }

      // Si está autenticado pero no es ADMIN, redirigir a unauthorized
      if (user && (!user.role || typeof user.role === 'object' && user.role.role !== 'ADMIN')) {
        console.log('Usuario no autorizado, redirigiendo a /unauthorized');
        router.replace('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no es ADMIN, no mostrar nada (se redirigirá)
  if (!isAuthenticated || (user && (!user.role || typeof user.role === 'object' && user.role.role !== 'ADMIN'))) {
    return null;
  }

  // Si es ADMIN, mostrar el contenido
  return <>{children}</>;
};