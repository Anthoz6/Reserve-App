import { apiRequest } from '../client';
import { API_ENDPOINTS, CreateReservationRequest } from '../endpoints';
import { Reservation, ReservationStatus } from '@/types/reservation';

export const reservationsService = {

    /**
     * Crear una nueva reserva (SOLO CUSTOMER)
     */
    async createReservation(reservationData: CreateReservationRequest): Promise<Reservation> {
        try {
            const response = await apiRequest.post<Reservation>(
                API_ENDPOINTS.reservations.create,
                reservationData
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
                API_ENDPOINTS.reservations.getMyReservations
            );
            return response;
        } catch (error) {
            throw error;
        }
    }
};