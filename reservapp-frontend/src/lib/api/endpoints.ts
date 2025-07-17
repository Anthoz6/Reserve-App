// src/lib/api/endpoints.ts
export const API_ENDPOINTS = {
    // Autenticación
    auth: {
      login: '/auth/login',
    },
    
    // Usuarios
    users: {
      getAll: '/users',
      create: '/users',
      update: (userId: number) => `/users/${userId}`,
    },
    
    // Servicios
    services: {
      getAll: '/services',
      create: '/services',
      getMyServices: '/services/me',
      update: (serviceId: number) => `/services/${serviceId}`,
      delete: (serviceId: number) => `/services/${serviceId}`,
    },
    
    // Reservas
    reservations: {
      create: '/reservations',
      getMyReservations: '/reservations/me',
    },
  } as const;
  
  // Tipos para las respuestas de la API
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  // Tipos para requests específicos
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      id: number;
      email: string;
      name: string;
      role: string;
    };
  }
  
  export interface CreateUserRequest {
    email: string;
    name: string;
    password: string;
    roleId: number;
  }
  
  export interface UpdateUserRequest {
    name?: string;
    email?: string;
    enabled?: boolean;
  }
  
  export interface CreateServiceRequest {
    title: string;
    description: string;
    price: number;
  }
  
  export interface UpdateServiceRequest {
    title?: string;
    description?: string;
    price?: number;
  }
  
  export interface CreateReservationRequest {
    serviceId: number;
    date: string; // ISO format
    time: string; // HH:MM:SS format
  }