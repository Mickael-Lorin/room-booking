import { apiRequest } from './http'
import type { User } from '../types/user'

export interface UpdateUserRolePayload {
    role: string
}

export interface UpdateUserStatusPayload {
    active: boolean
}

const ADMIN_USERS_ENDPOINT = '/admin/users'

export const adminApi = {
    getUsers(): Promise<User[]> {
        return apiRequest<User[]>(ADMIN_USERS_ENDPOINT, {
            authenticated: true,
        })
    },

    getUserById(userId: number): Promise<User> {
        return apiRequest<User>(`${ADMIN_USERS_ENDPOINT}/${userId}`, {
            authenticated: true,
        })
    },

    updateUserRole(userId: number, payload: UpdateUserRolePayload): Promise<void> {
        return apiRequest<void>(`${ADMIN_USERS_ENDPOINT}/${userId}/role`, {
            method: 'PATCH',
            authenticated: true,
            body: payload,
        })
    },

    updateUserStatus(userId: number, payload: UpdateUserStatusPayload): Promise<void> {
        return apiRequest<void>(`${ADMIN_USERS_ENDPOINT}/${userId}/status`, {
            method: 'PATCH',
            authenticated: true,
            body: payload,
        })
    },

    deleteUser(userId: number): Promise<void> {
        return apiRequest<void>(`${ADMIN_USERS_ENDPOINT}/${userId}`, {
            method: 'DELETE',
            authenticated: true,
        })
    },
}