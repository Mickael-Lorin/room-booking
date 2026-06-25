import { Route, Routes } from 'react-router-dom'
import { AdminRoute } from '../components/AdminRoute'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AdminReservationDashboard } from '../pages/AdminReservationDashboard'
import { AdminRoomDashboard } from '../pages/AdminRoomDashboard'
import { AdminUserDashboard } from '../pages/AdminUserDashboard'
import { AdminUserDetails } from '../pages/AdminUserDetails'
import { BookRoomPage } from '../pages/BookRoomPage'
import { HomePage } from '../pages/HomePage'
import { Login } from '../pages/Login'
import { MyReservationsPage } from '../pages/MyReservationsPage'
import { Register } from '../pages/Register'
import { RoomDetailPage } from '../pages/RoomDetailPage'
import { RoomListPage } from '../pages/RoomListPage'

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomListPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/rooms/:id/book" element={<BookRoomPage />} />
                <Route path="/me/reservations" element={<MyReservationsPage />} />
            </Route>

            <Route element={<AdminRoute />}>
                <Route path="/admin/users" element={<AdminUserDashboard />} />
                <Route path="/admin/users/:id" element={<AdminUserDetails />} />
                <Route path="/admin/rooms" element={<AdminRoomDashboard />} />
                <Route path="/admin/reservations" element={<AdminReservationDashboard />} />
            </Route>
        </Routes>
    )
}