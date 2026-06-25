import { Navigate } from 'react-router-dom';
import { authUtils } from '../services/AuthService'

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    if (!authUtils.isAuthenticated() || !authUtils.isAdmin()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};