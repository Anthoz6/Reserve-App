import { apiRequest } from '../client';
import { API_ENDPOINTS, CreateServiceRequest, UpdateServiceRequest } from '../endpoints';
import { Service } from '@/types/service';

export const servicesService = {
  /**
   * Crear un nuevo sercivio (SOLO PROVIDER)
   */
  async createService(serviceData: CreateServiceRequest): Promise<Service> {
    try {
      const response = await apiRequest.post<Service>(API_ENDPOINTS.services.create, serviceData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar un servicio (Solo PROVIDER dueño)
   */
  async updateService(serviceId: number, serviceData: UpdateServiceRequest): Promise<Service> {
    try {
      const response = await apiRequest.patch<Service>(
        API_ENDPOINTS.services.update(serviceId),
        serviceData,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar un servicio (Solo PROVIDER dueño)
   */
  async deleteService(serviceId: number): Promise<void> {
    try {
      await apiRequest.delete(API_ENDPOINTS.services.delete(serviceId));
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener mis servicios (SOLO PROVIDER)
   */
  async getMyServices(): Promise<Service[]> {
    try {
      const response = await apiRequest.get<Service[]>(API_ENDPOINTS.services.getMyServices);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener todos los servicios disponibles (Público/CUSTOMER)
   */
  async getAllServices(): Promise<Service[]> {
    try {
      const response = await apiRequest.get<Service[]>(API_ENDPOINTS.services.getAll);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
