// Middleware principal

import { NextRequest, NextResponse } from 'next/server';
import { shouldRunMiddleware } from './matchers';
import { handleRouteProtection, handleApiRouteProtection } from './handlers';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo ejecutar middleware en rutas específicas
  if (!shouldRunMiddleware(pathname)) {
    return NextResponse.next();
  }

  // Manejar rutas de API protegidas
  if (pathname.startsWith('/api/protected')) {
    return handleApiRouteProtection(request);
  }

  // Manejar rutas de páginas
  return handleRouteProtection(request);
}
