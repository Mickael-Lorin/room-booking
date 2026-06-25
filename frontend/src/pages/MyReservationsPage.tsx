import { Layout } from '../components/Layout'
import { cancelReservation, fetchMyReservations } from '../api/reservations'
import { ApiError } from '../api/http'
import { useAuth } from '../context/AuthContext'
import type { Reservation, ReservationStatus } from '../types/reservation'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/MyReservationsPage.css'

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  CANCELLED: 'Annulée',
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function MyReservationsPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  const loadReservations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchMyReservations()
      setReservations(data)
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        logout()
        navigate('/login')
        return
      }
      setError(err instanceof Error ? err.message : 'Impossible de charger vos réservations')
    } finally {
      setLoading(false)
    }
  }, [logout, navigate])

  useEffect(() => {
    void loadReservations()
  }, [loadReservations])

  const handleCancel = async (reservation: Reservation) => {
    const confirmed = window.confirm(
      `Annuler la réservation de « ${reservation.roomName} » le ${formatDateTime(reservation.startDateTime)} ?`
    )
    if (!confirmed) {
      return
    }

    setCancellingId(reservation.id)
    setError(null)

    try {
      await cancelReservation(reservation.id)
      setReservations((current) =>
        current.map((item) =>
          item.id === reservation.id ? { ...item, status: 'CANCELLED' } : item
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d\'annuler la réservation')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <Layout>
      <div className="reservations-page">
        <header className="reservations-page__header">
          <h1>Mes réservations</h1>
          <p>Historique de vos créneaux réservés et annulations.</p>
        </header>

        {loading && <p className="status-message status-message--loading">Chargement...</p>}
        {error && <p className="status-message status-message--error">{error}</p>}

        {!loading && reservations.length === 0 && (
          <div className="reservations-page__empty">
            <p>Vous n&apos;avez encore aucune réservation.</p>
            <Link to="/rooms" className="btn-primary">
              Parcourir les salles
            </Link>
          </div>
        )}

        {!loading && reservations.length > 0 && (
          <div className="reservations-table-wrapper">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Salle</th>
                  <th>Début</th>
                  <th>Fin</th>
                  <th>Participants</th>
                  <th>Statut</th>
                  <th>Objet</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      <Link to={`/rooms/${reservation.roomId}`}>{reservation.roomName}</Link>
                    </td>
                    <td>{formatDateTime(reservation.startDateTime)}</td>
                    <td>{formatDateTime(reservation.endDateTime)}</td>
                    <td>{reservation.attendeesCount}</td>
                    <td>
                      <span className={`reservation-status reservation-status--${reservation.status.toLowerCase()}`}>
                        {STATUS_LABELS[reservation.status]}
                      </span>
                    </td>
                    <td>{reservation.purpose ?? '—'}</td>
                    <td>
                      {reservation.status !== 'CANCELLED' ? (
                        <button
                          type="button"
                          className="btn-danger btn-sm"
                          disabled={cancellingId === reservation.id}
                          onClick={() => void handleCancel(reservation)}
                        >
                          {cancellingId === reservation.id ? 'Annulation...' : 'Annuler'}
                        </button>
                      ) : (
                        <span className="reservations-table__muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
