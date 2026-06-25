import type { Role } from './user'

export interface AuthResponse {
    accessToken: string
    refreshToken: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterPayload {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface DecodedToken {
    role: Role
    sub: string
    exp: number
}