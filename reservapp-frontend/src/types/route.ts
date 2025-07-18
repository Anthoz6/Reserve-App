import { RoleEnum } from './role';

export interface RouteConfig {
  path: string;
  roles?: RoleEnum[];
  requiresAuth: boolean;
  isPublic: boolean;
  redirectTo?: string;
}

export interface MiddlewareContext {
  pathname: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: RoleEnum;
  };
}

export interface RouteProtection {
  allowed: boolean;
  redirectTo?: string;
  reason?: 'unauthorized' | 'forbidden' | 'token_expired' | 'invalid_role';
}
