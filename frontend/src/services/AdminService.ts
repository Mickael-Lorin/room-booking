import { adminApi } from '../api/adminApi'
import { authService } from './AuthService'
import type { Role, User } from '../types/user'

function toBackendRole(role: Role | string): string {
    return role.replace('ROLE_', '')
}

export const adminService = {
    getUsers(): Promise<User[]> {
        return adminApi.getUsers()
    },

    getUserById(userId: number): Promise<User> {
        return adminApi.getUserById(userId)
    },

    updateUserRole(userId: number, role: Role | string): Promise<void> {
        return adminApi.updateUserRole(userId, {
            role: toBackendRole(role),
        })
    },

    updateUserStatus(userId: number, active: boolean): Promise<void> {
        return adminApi.updateUserStatus(userId, {
            active,
        })
    },

    deleteUser(userId: number): Promise<void> {
        return adminApi.deleteUser(userId)
    },
}

export const authUtils = {
    isAdmin(): boolean {
        return authService.isAdmin()
    },

    isAuthenticated(): boolean {
        return authService.isAuthenticated()
    },
}

export type { User, Role }