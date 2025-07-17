'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { RoleEnum } from '@/types/role'
import { LoadingSpinner } from '@/components/ui/loading'

interface RoleGuardProps {
  children: ReactNode
  requiredRoles: RoleEnum[]
  fallback?: ReactNode
  redirectTo?: string
}

export const RoleGuard = ({
  children,
  requiredRoles,
  fallback,
  redirectTo = '/unauthorized',
}: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated) {
        router.replace('/login')
        return
      }

      // Verificar si el usuario tiene alguno de los roles requeridos
      const hasRequiredRole = user && 
        user.role && 
        typeof user.role === 'object' && 
        requiredRoles.includes(user.role.role)

      if (!hasRequiredRole) {
        console.log('Usuario no autorizado, redirigiendo a', redirectTo)
        // Usar window.location para una redirección más inmediata
        window.location.href = redirectTo
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, redirectTo, router])

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado o no tiene los roles requeridos, no mostrar nada (se redirigirá)
  const hasRequiredRole = user && 
    user.role && 
    typeof user.role === 'object' && 
    requiredRoles.includes(user.role.role)

  if (!isAuthenticated || !hasRequiredRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-muted-foreground text-sm">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  // Si está autenticado y tiene los roles requeridos, mostrar el contenido
  return <>{children}</>
}