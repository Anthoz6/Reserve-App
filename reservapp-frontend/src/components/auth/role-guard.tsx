'use client'

import { ReactNode } from 'react'
import { useRouteGuard } from '@/hooks/useRouteGuard'
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
  redirectTo,
}: RoleGuardProps) => {
  const { isAuthorized, isChecking } = useRouteGuard({
    requiredRoles,
    redirectTo,
    requiresAuth: true,
  })

  if (isChecking) {
    return fallback || <LoadingSpinner />
  }

  if (!isAuthorized) {
    return null // La redirección se maneja en el hook
  }

  return <>{children}</>
}
