import { useEffect, useState } from 'react'
import { adminReservationService } from '../services/AdminReservationService'
import { Reservation } from '../types/reservation';


export function AdminReservationDashboard() {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [error, setError] = useState<string | null>(null)

    async function loadReservations() {
        try {
            const data = await adminReservationService.getReservations()
            setReservations(data)
        } catch {
            setError('Erreur lors du chargement des réservations')
        }
    }

    async function validateReservation(id: number) {
        const updated = await adminReservationService.validateReservation(id)

        setReservations((current) =>
            current.map((reservation) =>
                reservation.id === id ? updated : reservation
            )
        )
    }

    async function cancelReservation(id: number) {
        const updated = await adminReservationService.cancelReservation(id)

        setReservations((current) =>
            current.map((reservation) =>
                reservation.id === id ? updated : reservation
            )
        )
    }

    useEffect(() => {
        loadReservations()
    }, [])

    return (
        <main className="admin-page">
            <h1>Gestion des réservations</h1>

            {error && <p className="error-message">{error}</p>}

            <section className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Salle</th>
                        <th>Utilisateur</th>
                        <th>Début</th>
                        <th>Fin</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td>{reservation.id}</td>
                            <td>{reservation.room?.name}</td>
                            <td>{reservation.user?.email}</td>
                            <td>{reservation.startDateTime}</td>
                            <td>{reservation.endDateTime}</td>
                            <td>{reservation.status}</td>
                            <td>
                                <button
                                    type="button"
                                    onClick={() => validateReservation(reservation.id)}
                                    disabled={reservation.status === 'CONFIRMED'}
                                >
                                    Valider
                                </button>

                                <button
                                    type="button"
                                    onClick={() => cancelReservation(reservation.id)}
                                    disabled={reservation.status === 'CANCELLED'}
                                >
                                    Annuler
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