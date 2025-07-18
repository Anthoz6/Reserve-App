import { NextRequest } from 'next/server';
import { RoleEnum } from '@/types/role';
import { MiddlewareContext } from '@/types/route';

export const getTokenFromRequest = (request: NextRequest): string | undefined => {
  // Intenta obtener el token del header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Intenta obtener el token de las cookies
  // Primero busca con el nombre 'authToken' (usado en authContext.tsx y client.ts)
  const authTokenCookie = request.cookies.get('authToken');
  if (authTokenCookie) {
    return authTokenCookie.value;
  }

  // Como fallback, busca con el nombre 'token' (por compatibilidad)
  const tokenCookie = request.cookies.get('token');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  return undefined;
};

export const decodeJWT = (token: string): unknown => {
  try {
    // Decodifica el JWT (solo el payload, sin verificar la firma)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJWT(token) as {
      sub?: string;
      userId?: string;
      email?: string;
      role?: string;
      exp?: number;
    };
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    throw error;
  }
};

export const getUserFromToken = (token: string): MiddlewareContext['user'] | null => {
  try {
    const decoded = decodeJWT(token) as {
      sub?: string;
      userId?: string;
      email?: string;
      role?: string;
      exp?: number;
    };
    if (!decoded) return null;

    return {
      id: decoded.sub || decoded.userId || '',
      email: decoded.email || '',
      role: decoded.role as RoleEnum,
    };
  } catch {
    return null;
  }
};

export const createMiddlewareContext = (request: NextRequest): MiddlewareContext => {
  const token = getTokenFromRequest(request);
  const user = token ? getUserFromToken(token) || undefined : undefined;

  return {
    pathname: request.nextUrl.pathname,
    token,
    user,
  };
};
