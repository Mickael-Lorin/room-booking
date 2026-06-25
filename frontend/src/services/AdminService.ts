export type Role = 'ROLE_ADMIN' | 'ROLE_USER';

export interface User {
    id: number;
    email: string;
    role: Role;
}

const API_URL = 'http://localhost:8085/api/admin';

const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
    };
};

export const adminService = {
    getUsers: async (): Promise<User[]> => {
        const response = await fetch(`${API_URL}/users`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Erreur lors de la récupération");
        return response.json();
    },

    getUserById: async (userId: number): Promise<User> => {
        const response = await fetch(`${API_URL}/users/${userId}`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Utilisateur introuvable");
        return response.json();
    },

    updateUserRole: async (userId: number, role: string): Promise<void> => {
        // Nettoyage pour le backend (ADMIN au lieu de ROLE_ADMIN)
        const cleanRole = role.replace('ROLE_', '');

        const response = await fetch(`${API_URL}/users/${userId}/role`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ role: cleanRole })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erreur serveur :", errorText);
            throw new Error('Erreur lors de la mise à jour');
        }
    }
};

export const authUtils = {
    isAdmin: () => {
        const role = localStorage.getItem('USER_ROLE');
        return role === 'ROLE_ADMIN';
    },
    isAuthenticated: () => !!localStorage.getItem('ACCESS_TOKEN')
};