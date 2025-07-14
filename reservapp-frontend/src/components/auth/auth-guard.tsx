'use client'

import { ReactNode } from 'react'
import { useRouteGuard } from '@/hooks/useRouteGuard'
import { LoadingSpinner } from '@/components/ui/loading'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { isAuthorized, isChecking } = useRouteGuard({ requiresAuth: true })

  if (isChecking) {
    return fallback || <LoadingSpinner />
  }

  if (!isAuthorized) {
    return null // La redirección se maneja en el hook
  }

  return <>{children}</>
}
