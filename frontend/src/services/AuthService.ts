import { jwtDecode } from 'jwt-decode';

export interface AuthService {
    accessToken: string;
    refreshToken: string;
}

export interface DecodeToken {
    role: "ROLE_ADMIN" | "ROLE_USER";
    sub: string;
    exp: number;
}

const API_URL = "http://localhost:8085/api/v1/auth";

const handleResponse = async (response: Response) => {
    if(!response.ok){
        const errorData = await response.json().catch(() =>({message: "Erreur de connexion"}));
        throw new Error(errorData.message || "Erreur de connexion");
    }
    return await response.json();

};
export const loginService = async (credentials:  any ): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });
    const data: AuthResponse = await handleResponse(response);
    // On décode le token pour chopper le ROLE
    if (data.accessToken) {
        const decoded: DecodedToken = jwtDecode(data.accessToken);
        localStorage.setItem("ACCESS_TOKEN", data.accessToken);
        localStorage.setItem("USER_ROLE", decoded.role);
    }

    return data;
};

export const registerService = async (userData: any): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
   return handleResponse(response);
};