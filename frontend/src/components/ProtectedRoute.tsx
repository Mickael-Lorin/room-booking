import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    // Si l'utilisateur n'est pas connecté, redirection  page de connexion
    if(!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    // Sinon on affiche les enfants
    return <Outlet />;
}
