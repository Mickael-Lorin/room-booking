import { jwtDecode } from 'jwt-decode'
import { authApi } from '../api/authApi'
import {
    clearAuthStorage,
    getAccessToken,
    setAccessToken,
    USER_ROLE_KEY,
} from '../api/http'
import type {
    AuthResponse,
    DecodedToken,
    LoginCredentials,
    RegisterPayload,
} from '../types/auth'
import type { Role } from '../types/user'

function saveAuthSession(accessToken: string): void {
    const decoded = jwtDecode<DecodedToken>(accessToken)

    setAccessToken(accessToken)
    localStorage.setItem(USER_ROLE_KEY, decoded.role)
}

function getCurrentUserRole(): Role | null {
    return localStorage.getItem(USER_ROLE_KEY) as Role | null
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const authResponse = await authApi.login(credentials)

        saveAuthSession(authResponse.accessToken)

        return authResponse
    },

    register(payload: RegisterPayload): Promise<AuthResponse> {
        return authApi.register(payload)
    },

    logout(): void {
        clearAuthStorage()
    },

    isAuthenticated(): boolean {
        return !!getAccessToken()
    },

    isAdmin(): boolean {
        return getCurrentUserRole() === 'ROLE_ADMIN'
    },

    getRole(): Role | null {
        return getCurrentUserRole()
    },
}

export const loginService = authService.login
export const registerService = authService.register