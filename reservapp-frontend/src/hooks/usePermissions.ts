import { useMemo } from 'react'
import { useAuth } from './useAuth'
import { RoleEnum } from '@/types/role'
import { PERMISSIONS } from '@/types/permissions'

export const usePermissions = () => {
  const { user } = useAuth()

  const permissions = useMemo(() => {
    if (!user) return []
    const rolePermissions: Record<RoleEnum, string[]> = {
      [RoleEnum.ADMIN]: [
        PERMISSIONS.USERS.CREATE,
        PERMISSIONS.USERS.READ,
        PERMISSIONS.USERS.UPDATE,
        PERMISSIONS.USERS.DELETE,
        PERMISSIONS.SERVICES.READ,
        PERMISSIONS.RESERVATIONS.READ,
        PERMISSIONS.RESERVATIONS.UPDATE,
      ],
      [RoleEnum.PROVIDER]: [
        PERMISSIONS.SERVICES.CREATE,
        PERMISSIONS.SERVICES.READ,
        PERMISSIONS.SERVICES.UPDATE,
        PERMISSIONS.SERVICES.DELETE,
        PERMISSIONS.RESERVATIONS.READ,
        PERMISSIONS.RESERVATIONS.UPDATE,
      ],
      [RoleEnum.CUSTOMER]: [
        PERMISSIONS.SERVICES.READ,
        PERMISSIONS.RESERVATIONS.CREATE,
        PERMISSIONS.RESERVATIONS.READ,
        PERMISSIONS.RESERVATIONS.UPDATE,
      ],
    }
    return rolePermissions[user.role.role] || []
  }, [user])

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission)
  }

  const hasRole = (role: RoleEnum): boolean => {
    return user?.role.role === role
  }

  const hasAnyRole = (roles: RoleEnum[]): boolean => {
    return user ? roles.includes(user.role.role) : false
  }

  return {
    permissions,
    hasPermission,
    hasRole,
    hasAnyRole,
  }
} 