import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BookRoomPage } from './pages/BookRoomPage';
import { MyReservationsPage } from './pages/MyReservationsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { RoomListPage } from './pages/RoomListPage';
import './App.css';

function App() {
    return (
        <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/rooms" replace />} />
                <Route path="/rooms" element={<RoomListPage />} />
                <Route path="/rooms/:id" element={<RoomDetailPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/rooms/:id/book" element={<BookRoomPage />} />
                    <Route path="/me/reservations" element={<MyReservationsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
