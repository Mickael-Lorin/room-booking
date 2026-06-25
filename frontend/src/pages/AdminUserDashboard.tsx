import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {adminService, type Role} from '../services/AdminService';

export interface User {
    id: number;
    email: string;
    role: Role;
}

export const AdminUserDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch(err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const handleRoleChange = async (user: User, newRole: 'ROLE_ADMIN' | 'ROLE_USER') => {
        try {
            await adminService.updateUserRole(user.id, newRole);
            // Mise à jour de l'état local pour rafraîchir l'interface
            setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
        } catch (err) {
            alert("Erreur serveur lors de la mise à jour");
        }
    };
    if(loading) return <div>Chargement ...</div>;
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
            <table className="w-full border-collapse border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Rôle</th>
                    <th className="border p-2">Voir details</th>

                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="text-center">
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">
                            <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user, e.target.value as 'ROLE_ADMIN' | 'ROLE_USER')}
                                className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="ROLE_ADMIN">ADMIN</option>
                                <option value="ROLE_USER">USER</option>
                            </select>
                        </td>
                        <td className="border p-2 flex justify-center gap-2">
                            {/* Bouton Voir les détails */}
                            <Link
                                to={`/admin/users/${user.id}`}
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-sm"
                            >
                                View Details
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

}
