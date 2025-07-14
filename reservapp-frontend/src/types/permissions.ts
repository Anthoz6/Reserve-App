import { RoleEnum } from './role'

export interface Permission {
  resource: string
  action: string
  roles: RoleEnum[]
}

export interface UserPermissions {
  role: RoleEnum
  permissions: Permission[]
}

export const PERMISSIONS = {
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
  SERVICES: {
    CREATE: 'services:create',
    READ: 'services:read',
    UPDATE: 'services:update',
    DELETE: 'services:delete',
  },
  RESERVATIONS: {
    CREATE: 'reservations:create',
    READ: 'reservations:read',
    UPDATE: 'reservations:update',
    DELETE: 'reservations:delete',
  },
} as const