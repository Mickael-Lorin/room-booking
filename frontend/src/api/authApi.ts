import { apiRequest } from './http'
import type { AuthResponse, LoginCredentials, RegisterPayload } from '../types/auth'

const AUTH_ENDPOINT = '/v1/auth'

export const authApi = {
    async login(credentials: LoginCredentials) {
        return apiRequest<AuthResponse>(`${AUTH_ENDPOINT}/login`, {
            method: 'POST',
            body: credentials,
        });
    },

    async register(payload: RegisterPayload) {
        return apiRequest<AuthResponse>(`${AUTH_ENDPOINT}/register`, {
            method: 'POST',
            body: payload,
        });
    }

}