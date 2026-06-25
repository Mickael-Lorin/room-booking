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

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };
    const response = await fetch(`http://localhost:8085/api${endpoint}`, { ...options, headers });

    if(response.status === 401 || response.status === 403){
        localStorage.clear();
        window.location.href = '/login';
    }
    return response;
};