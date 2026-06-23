import { Navigate, Route, Routes } from 'react-router-dom'
import { RoomDetailPage } from './pages/RoomDetailPage'
import { RoomListPage } from './pages/RoomListPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" replace />} />
      <Route path="/rooms" element={<RoomListPage />} />
      <Route path="/rooms/:id" element={<RoomDetailPage />} />
    </Routes>
  )
}

export default App
