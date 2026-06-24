import { Layout } from '../components/Layout'
import { createReservation, fetchRoomReservations } from '../api/reservations'
import { ApiError } from '../api/http'
import { fetchRoomById } from '../api/rooms'
import { useAuth } from '../context/AuthContext'
import type { Reservation } from '../types/reservation'
import type { Room } from '../types/room'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function toLocalDateTime(date: string, time: string): string {
  return `${date}T${time}:00`
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function BookRoomPage() {
  const { logout } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room | null>(null)
  const [existingReservations, setExistingReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [attendeesCount, setAttendeesCount] = useState(1)
  const [purpose, setPurpose] = useState('')

  useEffect(() => {
    const roomId = Number(id)

    if (!Number.isInteger(roomId) || roomId <= 0) {
      setError('Identifiant de salle invalide')
      setLoading(false)
      return
    }

    Promise.all([fetchRoomById(roomId), fetchRoomReservations(roomId)])
      .then(([roomData, reservations]) => {
        setRoom(roomData)
        setExistingReservations(
          reservations.filter((reservation) => reservation.status !== 'CANCELLED')
        )
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Impossible de charger la salle')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!room) {
      return
    }

    setError(null)
    setSuccess(null)
    setSubmitting(true)

    try {
      await createReservation({
        roomId: room.id,
        startDateTime: toLocalDateTime(date, startTime),
        endDateTime: toLocalDateTime(date, endTime),
        attendeesCount,
        purpose: purpose.trim() || undefined,
      })

      setSuccess('Réservation créée avec succès.')
      setTimeout(() => navigate('/me/reservations'), 1200)
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        logout()
        navigate('/login')
        return
      }
      setError(err instanceof Error ? err.message : 'Impossible de créer la réservation')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="booking-page">
        {loading && <p className="status-message status-message--loading">Chargement...</p>}
        {error && !room && <p className="status-message status-message--error">{error}</p>}

        {room && (
          <>
            <header className="booking-page__header">
              <Link to={`/rooms/${room.id}`} className="booking-page__back">
                ← Retour à la salle
              </Link>
              <h1>Réserver « {room.name} »</h1>
              <p className="booking-page__subtitle">
                Capacité maximale : {room.capacity} personnes · {room.location}
              </p>
            </header>

            <div className="booking-page__grid">
              <form className="booking-form" onSubmit={(event) => void handleSubmit(event)}>
                <h2>Créneau souhaité</h2>

                {error && <p className="status-message status-message--error">{error}</p>}
                {success && <p className="status-message status-message--success">{success}</p>}

                <label className="booking-form__field">
                  <span>Date</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                </label>

                <div className="booking-form__row">
                  <label className="booking-form__field">
                    <span>Heure de début</span>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                      required
                    />
                  </label>

                  <label className="booking-form__field">
                    <span>Heure de fin</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                      required
                    />
                  </label>
                </div>

                <label className="booking-form__field">
                  <span>Nombre de participants</span>
                  <input
                    type="number"
                    min={1}
                    max={room.capacity}
                    value={attendeesCount}
                    onChange={(event) => setAttendeesCount(Number(event.target.value))}
                    required
                  />
                </label>

                <label className="booking-form__field">
                  <span>Objet de la réservation (optionnel)</span>
                  <textarea
                    value={purpose}
                    onChange={(event) => setPurpose(event.target.value)}
                    rows={3}
                    placeholder="Ex. : Cours de mathématiques, réunion pédagogique..."
                  />
                </label>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting || !room.available}
                >
                  {submitting ? 'Réservation en cours...' : 'Confirmer la réservation'}
                </button>

                {!room.available && (
                  <p className="booking-form__hint">Cette salle n&apos;est pas disponible à la réservation.</p>
                )}
              </form>

              <aside className="booking-sidebar">
                <h2>Créneaux déjà réservés</h2>
                {existingReservations.length === 0 ? (
                  <p className="booking-sidebar__empty">Aucune réservation active sur cette salle.</p>
                ) : (
                  <ul className="booking-sidebar__list">
                    {existingReservations.map((reservation) => (
                      <li key={reservation.id} className="booking-sidebar__item">
                        <strong>{formatDateTime(reservation.startDateTime)}</strong>
                        <span>→ {formatDateTime(reservation.endDateTime)}</span>
                        {reservation.purpose && <em>{reservation.purpose}</em>}
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
