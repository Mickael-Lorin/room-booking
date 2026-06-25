export type Role = 'ROLE_ADMIN' | 'ROLE_USER'

export interface User {
    id: number
    email: string
    firstName?: string
    lastName?: string
    role: Role
    active?: boolean
}