import { apiRequest } from './http'
import type { AuthResponse, LoginCredentials, RegisterPayload } from '../types/auth'

const AUTH_ENDPOINT = '/v1/auth'

export const authApi = {
    login(credentials: LoginCredentials): Promise<AuthResponse> {
        return apiRequest<AuthResponse>(`${AUTH_ENDPOINT}/login`, {
            method: 'POST',
            body: credentials,
        })
    },

    register(payload: RegisterPayload): Promise<AuthResponse> {
        return apiRequest<AuthResponse>(`${AUTH_ENDPOINT}/register`, {
            method: 'POST',
            body: payload,
        })
    },
}