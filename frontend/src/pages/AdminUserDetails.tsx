import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {adminService, type Role} from '../services/AdminService';

export interface User {
    id: number;
    email: string;
    role: Role;
}
export const AdminUserDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (id) {

            adminService.getUserById(Number(id)).then(setUser).catch(console.error);
        }
    }, [id]);

    const handleRoleChange = async (newRole: string) => {
        if (!user) return;
        await adminService.updateUserRole(user.id, newRole);
        setUser({ ...user, role: newRole as any });
    };

    if (!user) return <div>Chargement...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-4 text-indigo-600">← Retour</button>
            <h1 className="text-2xl font-bold mb-6">Détails de l'utilisateur</h1>

            <div className="bg-white p-6 shadow rounded">
                <p><strong>Email:</strong> {user.email}</p>
                <p className="mt-4"><strong>Rôle actuel:</strong> {user.role.replace('ROLE_', '')}</p>

                <div className="mt-6">
                    <label className="block mb-2 font-medium">Changer le rôle:</label>
                    <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="ROLE_ADMIN">ADMIN</option>
                        <option value="ROLE_USER">USER</option>
                    </select>
                </div>
            </div>
        </div>
    );
};