import { RoleEnum } from '@/types/role'
import { RouteConfig } from '@/types/route'

export const PUBLIC_ROUTES: string[] = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/unauthorized',
]

export const AUTH_ROUTES: string[] = [
  '/login',
  '/register',
]

export const PROTECTED_ROUTES: RouteConfig[] = [
  // Admin routes
  {
    path: '/dashboard/admin',
    roles: [RoleEnum.ADMIN],
    requiresAuth: true,
    isPublic: false,
  },
  {
    path: '/dashboard/admin/users',
    roles: [RoleEnum.ADMIN],
    requiresAuth: true,
    isPublic: false,
  },
  {
    path: '/dashboard/admin/users/new',
    roles: [RoleEnum.ADMIN],
    requiresAuth: true,
    isPublic: false,
  },
  {
    path: '/dashboard/admin/users/edit',
    roles: [RoleEnum.ADMIN],
    requiresAuth: true,
    isPublic: false,
  },
  // Protección para cualquier otra ruta bajo /dashboard/admin/*
  {
    path: '/dashboard/admin/*',
    roles: [RoleEnum.ADMIN],
    requiresAuth: true,
    isPublic: false,
  },
  
  // Provider routes
  {
    path: '/dashboard/provider',
    roles: [RoleEnum.PROVIDER],
    requiresAuth: true,
    isPublic: false,
  },
  {
    path: '/dashboard/provider/*',
    roles: [RoleEnum.PROVIDER],
    requiresAuth: true,
    isPublic: false,
  },
  {
    path: '/dashboard/provider/services',
    roles: [RoleEnum.PROVIDER],
    requiresAuth: true,
    isPublic: false,
  },
  
  // Customer routes
  {
    path: '/dashboard/customer',
    roles: [RoleEnum.CUSTOMER],
    requiresAuth: true,
    isPublic: false,
  },
  {
    path: '/dashboard/customer/*',
    roles: [RoleEnum.CUSTOMER],
    requiresAuth: true,
    isPublic: false,
  },
  {
    path: '/dashboard/customer/reservations',
    roles: [RoleEnum.CUSTOMER],
    requiresAuth: true,
    isPublic: false,
  },
  
  // Shared protected routes
  {
    path: '/dashboard',
    roles: [RoleEnum.ADMIN, RoleEnum.PROVIDER, RoleEnum.CUSTOMER],
    requiresAuth: true,
    isPublic: false,
    redirectTo: '/dashboard/redirect', // Redirige según el rol
  },
  {
    path: '/profile',
    roles: [RoleEnum.ADMIN, RoleEnum.PROVIDER, RoleEnum.CUSTOMER],
    requiresAuth: true,
    isPublic: false,
  },
]

export const ROLE_REDIRECTS: Record<RoleEnum, string> = {
  [RoleEnum.ADMIN]: '/dashboard/admin',
  [RoleEnum.PROVIDER]: '/dashboard/provider',
  [RoleEnum.CUSTOMER]: '/dashboard/customer',
}