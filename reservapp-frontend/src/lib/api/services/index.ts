// src/lib/api/services/index.ts
export { authService } from './auth_service';
export { usersService } from './users_service';
export { servicesService } from './services_service';
export { reservationsService } from './reservations_service';

// Re-exportar tipos y endpoints para fácil acceso
export * from '../endpoints';
export * from '../client';
