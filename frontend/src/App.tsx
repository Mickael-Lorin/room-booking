

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ProtectedRoute } from './components/ProtectedRoute'
import { BookRoomPage } from './pages/BookRoomPage'
import { MyReservationsPage } from './pages/MyReservationsPage'
import { RoomDetailPage } from './pages/RoomDetailPage'
import { RoomListPage } from './pages/RoomListPage'
import { HomePage } from './pages/HomePage'
import { AdminUserDashboard } from './pages/AdminUserDashboard';
import { AdminUserDetails } from './pages/AdminUserDetails';


import './App.css'
import './styles/Components.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomListPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/rooms/:id/book" element={<BookRoomPage />} />
            <Route path="/me/reservations" element={<MyReservationsPage />} />
            <Route path="/admin/users" element={<AdminUserDashboard />} />
            <Route path="/admin/users/:id" element={<AdminUserDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
