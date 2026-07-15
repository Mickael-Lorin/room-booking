import { apiRequest } from './http'
import type { AuthResponse, LoginCredentials, RegisterPayload } from '../types/auth'

const AUTH_ENDPOINT = '/v1/auth'

export const authApi = {
    async login(credentials: LoginCredentials) {
        return apiRequest<AuthResponse>('/api/v1/auth/login', {
            method: 'POST',
            body: credentials,
        });
    },

    async register(payload: RegisterPayload) {
        return apiRequest<AuthResponse>('/api/v1/auth/register', {
            method: 'POST',
            body: payload,
        });
    }

}