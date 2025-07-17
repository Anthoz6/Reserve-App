// Rutas protegidas que requieren rol ADMIN

export const ADMIN_ROUTES = [
  '/dashboard/admin',
  '/dashboard/admin/users',
  '/dashboard/admin/users/new',
  '/dashboard/admin/users/edit',
];

/**
 * Verifica si una ruta requiere permisos de administrador
 */
export const isAdminRoute = (pathname: string): boolean => {
  return ADMIN_ROUTES.some(route => {
    // Coincidencia exacta
    if (route === pathname) return true;
    
    // Coincidencia con parámetros de consulta (como /dashboard/admin/users/edit?id=1)
    if (pathname.includes('?')) {
      const basePath = pathname.split('?')[0];
      if (route === basePath) return true;
    }
    
    // Coincidencia con rutas que tienen un patrón específico
    if (route.endsWith('edit') && pathname.startsWith(route)) return true;
    
    return false;
  });
};