import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'
import { RoleEnum } from '@/types/role'

interface UseRouteGuardProps {
  requiredRoles?: RoleEnum[]
  redirectTo?: string
  requiresAuth?: boolean
}

export const useRouteGuard = ({
  requiredRoles = [],
  redirectTo = '/unauthorized',
  requiresAuth = true,
}: UseRouteGuardProps = {}) => {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (isLoading) return

    const checkAuthorization = () => {
      if (!requiresAuth) {
        setIsAuthorized(true)
        setIsChecking(false)
        return
      }
      if (!user || !token) {
        router.push('/login')
        return
      }
      if (requiredRoles.length > 0) {
        if (!requiredRoles.includes(user.role.role)) {
          router.push(redirectTo)
          return
        }
      }
      setIsAuthorized(true)
      setIsChecking(false)
    }
    checkAuthorization()
  }, [user, token, isLoading, requiredRoles, redirectTo, requiresAuth, router])

  return {
    isAuthorized,
    isChecking,
    user,
  }
} 