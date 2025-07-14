import { MiddlewareContext, RouteProtection } from '@/types/route'
import { PUBLIC_ROUTES, AUTH_ROUTES, PROTECTED_ROUTES, ROLE_REDIRECTS } from './route-config'
import { isTokenExpired } from './auth-utils'

export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => {
    if (route === pathname) return true
    if (route.endsWith('*')) {
      const basePath = route.slice(0, -1)
      return pathname.startsWith(basePath)
    }
    return false
  })
}

export const isAuthRoute = (pathname: string): boolean => {
  return AUTH_ROUTES.includes(pathname)
}

export const findProtectedRoute = (pathname: string) => {
  return PROTECTED_ROUTES.find(route => {
    if (route.path === pathname) return true
    if (route.path.endsWith('*')) {
      const basePath = route.path.slice(0, -1)
      return pathname.startsWith(basePath)
    }
    return false
  })
}

export const checkRouteProtection = (context: MiddlewareContext): RouteProtection => {
  const { pathname, token, user } = context
  
  // 1. Rutas públicas - siempre permitidas
  if (isPublicRoute(pathname)) {
    return { allowed: true }
  }
  
  // 2. Rutas de autenticación - redirigir si ya está autenticado
  if (isAuthRoute(pathname)) {
    if (token && !isTokenExpired(token) && user) {
      return {
        allowed: false,
        redirectTo: ROLE_REDIRECTS[user.role] || '/dashboard',
        reason: 'unauthorized'
      }
    }
    return { allowed: true }
  }
  
  // 3. Rutas protegidas - verificar autenticación y roles
  const protectedRoute = findProtectedRoute(pathname)
  if (protectedRoute) {
    // Verificar si tiene token
    if (!token) {
      return {
        allowed: false,
        redirectTo: '/login',
        reason: 'unauthorized'
      }
    }
    
    // Verificar si el token no ha expirado
    if (isTokenExpired(token)) {
      return {
        allowed: false,
        redirectTo: '/login',
        reason: 'token_expired'
      }
    }
    
    // Verificar si el usuario existe
    if (!user) {
      return {
        allowed: false,
        redirectTo: '/login',
        reason: 'unauthorized'
      }
    }
    
    // Verificar roles si están definidos
    if (protectedRoute.roles && protectedRoute.roles.length > 0) {
      if (!protectedRoute.roles.includes(user.role)) {
        return {
          allowed: false,
          redirectTo: '/unauthorized',
          reason: 'invalid_role'
        }
      }
    }
    
    // Manejar redirección especial para /dashboard
    if (protectedRoute.redirectTo === '/dashboard/redirect') {
      return {
        allowed: false,
        redirectTo: ROLE_REDIRECTS[user.role] || '/dashboard',
        reason: 'unauthorized'
      }
    }
    
    return { allowed: true }
  }
  
  // 4. Rutas no definidas - por defecto requieren autenticación
  if (!token || isTokenExpired(token)) {
    return {
      allowed: false,
      redirectTo: '/login',
      reason: 'unauthorized'
    }
  }
  
  return { allowed: true }
}