import { Navigate, Outlet } from 'react-router-dom'

function isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken')
}

function isAdmin(): boolean {
    return localStorage.getItem('USER_ROLE') === 'ROLE_ADMIN'
}

export function AdminRoute() {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin()) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}