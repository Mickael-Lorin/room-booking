import { createContext, useState, useContext, type ReactNode } from 'react';

export interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const storedToken = localStorage.getItem('accessToken');
    const [token, setToken] = useState<string | null>(storedToken);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(storedToken?.trim()));

    const login = (accessToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        setToken(accessToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    // Correction : useContext (le 'c' doit être en majuscule)
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};

