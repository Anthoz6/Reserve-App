// Patrones de rutas a interceptar

export const MIDDLEWARE_MATCHERS = [
    // Incluir todas las rutas del dashboard
    '/dashboard/:path*',
    
    // Incluir rutas de autenticación
    '/login',
    '/register',
    
    // Incluir rutas protegidas específicas
    '/profile',
    '/settings',
    
    // Incluir rutas de API si es necesario
    '/api/protected/:path*',
  ]
  
  export const shouldRunMiddleware = (pathname: string): boolean => {
    return MIDDLEWARE_MATCHERS.some(matcher => {
      const regex = new RegExp(
        '^' + matcher.replace(/\*/g, '.*').replace(/:\w+/g, '[^/]+') + '$'
      )
      return regex.test(pathname)
    })
  }