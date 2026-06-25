import { handleResponse } from '../api/http'

const API_URL = '/api'

export const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const deleteUser = async (id: number) => {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    return handleResponse(response);
}