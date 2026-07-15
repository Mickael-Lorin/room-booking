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

function saveAuthSession(authResponse: any): void {
    // On essaie de l'attraper sous toutes ses formes possibles
    const token = authResponse?.accessToken ||
        authResponse?.token ||
        authResponse?.['accessToken()'] || // Format méthode record brut
        (typeof authResponse === 'string' ? authResponse : null); // Si le serveur a renvoyé une chaîne brute

    if (!token) {
        // Ajoutons un console.log temporaire pour voir la tête de l'intrus en direct !
        console.log("Voici ce que le serveur a VRAIMENT envoyé :", authResponse);
        throw new Error("Aucun jeton de sécurité (accessToken ou token) n'a été trouvé dans la réponse du serveur.");
    }

    const decoded = jwtDecode<DecodedToken>(token)
    setAccessToken(token)

    // Si ton token JWT utilise 'roles' ou 'role', on s'adapte
    const userRole = decoded.role || (decoded as any).roles || '';
    localStorage.setItem(USER_ROLE_KEY, userRole)
}

function getCurrentUserRole(): Role | null {
    return localStorage.getItem(USER_ROLE_KEY) as Role | null
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const authResponse = await authApi.login(credentials)
        // On passe l'objet entier nettoyé
        saveAuthSession(authResponse)
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
        const role = getCurrentUserRole()
        return role === 'ROLE_ADMIN' || role === 'ADMIN'
    },

    getRole(): Role | null {
        return getCurrentUserRole()
    },
}

export const loginService = authService.login
export const registerService = authService.register