// Lógica de manejo de rutas

import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareContext } from '@/lib/auth/auth-utils'
import { checkRouteProtection } from '@/lib/auth/route-guards'

export const handleRouteProtection = (request: NextRequest): NextResponse => {
  const context = createMiddlewareContext(request)
  const protection = checkRouteProtection(context)
  
  if (!protection.allowed && protection.redirectTo) {
    const url = request.nextUrl.clone()
    url.pathname = protection.redirectTo
    
    // Agregar parámetros de query para debugging/logging
    if (protection.reason) {
      url.searchParams.set('reason', protection.reason)
    }
    
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const handleApiRouteProtection = (request: NextRequest): NextResponse => {
  const context = createMiddlewareContext(request)
  const protection = checkRouteProtection(context)
  
  if (!protection.allowed) {
    return NextResponse.json(
      { error: 'Unauthorized', reason: protection.reason },
      { status: 401 }
    )
  }
  
  return NextResponse.next()
}