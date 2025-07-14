'use client'

import { ReactNode } from 'react'
import { useRouteGuard } from '@/hooks/useRouteGuard'
import { RoleEnum } from '@/types/role'
import { LoadingSpinner } from '@/components/ui/loading'

interface RouteGuardProps {
  children: ReactNode
  requiredRoles?: RoleEnum[]
  requiresAuth?: boolean
  redirectTo?: string
  fallback?: ReactNode
}

export const RouteGuard = ({
  children,
  requiredRoles,
  requiresAuth = true,
  redirectTo,
  fallback,
}: RouteGuardProps) => {
  const { isAuthorized, isChecking } = useRouteGuard({
    requiredRoles,
    requiresAuth,
    redirectTo,
  })

  if (isChecking) {
    return fallback || <LoadingSpinner />
  }

  if (!isAuthorized) {
    return null // La redirección se maneja en el hook
  }

  return <>{children}</>
}
