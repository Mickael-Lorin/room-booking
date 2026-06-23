import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { RoomListPage } from './pages/RoomListPage';
import './App.css';

function App() {
    return (
        <AuthProvider>
        <BrowserRouter>
            <Routes>
                {/* Routes Publiques */}
                <Route path="/" element={<Navigate to="/rooms" replace />} />
                <Route path="/rooms" element={<RoomListPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Routes Protégées */}
                <Route element={<ProtectedRoute />}>
                    {/* Juste pour que la fonctionnalité fonctionne a remettre dans la partie publique*/}
                    <Route path="/rooms/:id" element={<RoomDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
        </AuthProvider>
    );
}

export default App;