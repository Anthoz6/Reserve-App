'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_REDIRECTS } from '@/lib/auth/route-config';

export const UnauthorizedComponent = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleGoHome = () => {
    if (user) {
      router.push(ROLE_REDIRECTS[user.role.role] || '/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Acceso Denegado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            No tienes permisos para acceder a esta página.
          </p>
          <div className="flex flex-col space-y-2">
            <Button onClick={handleGoHome} className="w-full">
              Ir al Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
