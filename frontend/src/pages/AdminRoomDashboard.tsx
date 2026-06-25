import { useEffect, useState } from 'react'
import { adminRoomService } from '../services/AdminRoomService'
import type { Room } from '../types/room'

export function AdminRoomDashboard() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [error, setError] = useState<string | null>(null)

    async function loadRooms() {
        try {
            const data = await adminRoomService.getRooms()
            setRooms(data)
        } catch {
            setError('Erreur lors du chargement des salles')
        }
    }

    async function deleteRoom(id: number) {
        await adminRoomService.deleteRoom(id)

        setRooms((current) => current.filter((room) => room.id !== id))
    }

    useEffect(() => {
        loadRooms()
    }, [])

    return (
        <main className="admin-page">
            <h1>Gestion des salles</h1>

            {error && <p className="error-message">{error}</p>}

            <section className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Capacité</th>
                        <th>Localisation</th>
                        <th>Disponible</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {rooms.map((room) => (
                        <tr key={room.id}>
                            <td>{room.id}</td>
                            <td>{room.name}</td>
                            <td>{room.capacity}</td>
                            <td>{room.location}</td>
                            <td>{room.available ? 'Oui' : 'Non'}</td>
                            <td>
                                <button type="button">
                                    Modifier
                                </button>

                                <button
                                    type="button"
                                    onClick={() => deleteRoom(room.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>
        </main>
    )
}