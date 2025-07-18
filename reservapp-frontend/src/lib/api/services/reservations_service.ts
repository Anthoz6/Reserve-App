import { apiRequest } from '../client';
import { API_ENDPOINTS, CreateReservationRequest } from '../endpoints';
import { Reservation } from '@/types/reservation';

export const reservationsService = {
  /**
   * Crear una nueva reserva (SOLO CUSTOMER)
   */
  async createReservation(reservationData: CreateReservationRequest): Promise<Reservation> {
    try {
      // Usar directamente los datos ya que están en el formato correcto (SNAKE_CASE)
      const response = await apiRequest.post<Reservation>(
        API_ENDPOINTS.reservations.create,
        reservationData,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener mis reservas (Solo CUSTOMER)
   */
  async getMyReservations(): Promise<Reservation[]> {
    try {
      const response = await apiRequest.get<Reservation[]>(
        API_ENDPOINTS.reservations.getMyReservations,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener reservas para mis servicios (Solo PROVIDER)
   * NOTA: Esta función es un mock ya que el backend aún no implementa este endpoint
   */
  async getProviderReservations(): Promise<Reservation[]> {
    try {
      // Simulación de endpoint no implementado en el backend
      throw new Error('API_NOT_IMPLEMENTED');

      // Código que se usaría cuando el backend implemente el endpoint:
      // const response = await apiRequest.get<Reservation[]>(
      //   API_ENDPOINTS.reservations.getProviderReservations
      // );
      // return response;
    } catch (error) {
      if (error instanceof Error && error.message === 'API_NOT_IMPLEMENTED') {
        console.warn(
          'El endpoint para obtener reservas de proveedor no está implementado en el backend',
        );
        // Devolver datos de ejemplo para desarrollo
        return [];
      }
      throw error;
    }
  },

  /**
   * Obtener estadísticas de reservas para el proveedor
   * NOTA: Esta función es un mock ya que el backend aún no implementa este endpoint
   */
  async getProviderReservationStats(): Promise<{
    pendingCount: number;
    totalIncome: number;
  }> {
    try {
      // Simulación de endpoint no implementado en el backend
      throw new Error('API_NOT_IMPLEMENTED');

      // Código que se usaría cuando el backend implemente el endpoint:
      // const response = await apiRequest.get<{
      //   pendingCount: number;
      //   totalIncome: number;
      // }>(API_ENDPOINTS.reservations.getProviderStats);
      // return response;
    } catch (error) {
      if (error instanceof Error && error.message === 'API_NOT_IMPLEMENTED') {
        console.warn(
          'El endpoint para estadísticas de reservas no está implementado en el backend',
        );
        // Devolver datos de ejemplo para desarrollo
        return {
          pendingCount: 0,
          totalIncome: 0,
        };
      }
      throw error;
    }
  },
};
