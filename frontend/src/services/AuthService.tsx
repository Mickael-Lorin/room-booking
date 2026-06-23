export interface AuthService {
    accessToken: string;
    refreshToken: string;
}

const API_URL = "http://localhost:8085/api/v1/auth";

export const loginService = async (credentials:  any ): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });
    if(!response.ok){
        const errorData = await response.text();
        throw new Error(errorData || "Echec de la connexion");
    }
    return await response.json();
};

export const registerService = async (userData: any): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
    if(!response.ok){
        throw new Error("Echec de l'enregistrement");
    }
    return await response.json();
};