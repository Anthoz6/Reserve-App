import { apiRequest } from "../client"
import { API_ENDPOINTS, CreateUserRequest, UpdateUserRequest } from "../endpoints"
import { User } from '@/types/user'

export const usersService = {
    /** 
     * Crear un nuevo usuario (SOLO ADMIN)
     */
    async createUser(userData: CreateUserRequest): Promise<User> {
        try {
            const response = await apiRequest.post<User>(
                API_ENDPOINTS.users.create,
                userData
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Actualizar informacion de un usuario (SOLO ADMIN)
     */
    async updateUser(userId: number, userData: UpdateUserRequest): Promise<User> {
        try {
            const response = await apiRequest.patch<User>(
                API_ENDPOINTS.users.update(userId),
                userData
            );
            return response;
        } catch (error) {
            throw error;
        }
    },



    /**
     * Obtener todos los usuarios (SOLO ADMIN)
     */
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await apiRequest.get<User[]>(API_ENDPOINTS.users.getAll);
            return response;
        } catch (error) {
            throw error;
        }
    }

};