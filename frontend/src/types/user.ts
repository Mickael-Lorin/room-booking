
export interface user {
    id: number;
    email: string;
    role: Role;
}
export type Role = 'ROLE_ADMIN' | 'ROLE_USER';
