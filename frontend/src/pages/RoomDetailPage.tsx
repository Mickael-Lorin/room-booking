import { Layout } from '../components/Layout'
import { fetchRoomById } from '../api/rooms'
import type { Room } from '../types/room'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IoIosBackspace } from "react-icons/io";

export function RoomDetailPage() {
  const { id } = useParams()
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const roomId = Number(id)

    if (!Number.isInteger(roomId) || roomId <= 0) {
      setError('Identifiant de salle invalide')
      setLoading(false)
      return
    }

    void fetchRoomById(roomId)
      .then(setRoom)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Impossible de charger la salle')
      })
      .finally(() => setLoading(false))
  }, [id])

  return (
    <Layout>
      <div className="room-detail-container">
        {loading && <p className="status-message status-message--loading">Chargement des détails...</p>}
        {error && <p className="status-message status-message--error">{error}</p>}

        {room && (
          <div className="room-detail">
            {/* Colonne Gauche : Infos principales */}
            <article className="room-detail__main">
              <div className="room-detail__header">
                <Link to="/rooms" className="room-detail__back-link">
                  <IoIosBackspace />
                </Link>
                <h2 className="room-detail__title">{room.name}</h2>
              </div>

              {room.description ? (
                <p className="room-detail__description">{room.description}</p>
              ) : (
                <p className="room-detail__description room-detail__description--empty">Aucune description disponible pour cette salle.</p>
              )}

              <h3 className="room-detail__section-subtitle">Caractéristiques générales</h3>
              <dl className="room-detail__specs-list">
                <div className="room-detail__spec-item">
                  <dt className="room-detail__spec-term">Capacité maximale</dt>
                  <dd className="room-detail__spec-desc">{room.capacity} personnes</dd>
                </div>
                <div className="room-detail__spec-item">
                  <dt className="room-detail__spec-term">Localisation</dt>
                  <dd className="room-detail__spec-desc">{room.location}</dd>
                </div>
                <div className="room-detail__spec-item">
                  <dt className="room-detail__spec-term">Équipements inclus</dt>
                  <dd className="room-detail__spec-desc">{room.equipment ?? 'Aucun équipement spécifique renseigné'}</dd>
                </div>
              </dl>
            </article>

            {/* Colonne Droite : Sticky Panel d'état / Action */}
            <aside className="room-detail__sidebar">
              <div className="room-booking-card">
                <h3 className="room-booking-card__title">Statut de la salle</h3>
                <span className={`room-badge ${room.available ? 'room-badge--available' : 'room-badge--unavailable'}`}>
                  {room.available ? '● Disponible immédiatement' : '● Occupée / Indisponible'}
                </span>

                <div className="room-booking-card__summary">
                  <div className="room-booking-card__row">
                    <span>Emplacement</span>
                    <span>{room.location}</span>
                  </div>
                  <div className="room-booking-card__row">
                    <span>Places</span>
                    <span>{room.capacity} pers.</span>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  disabled={!room.available}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {room.available ? 'Réserver cette salle' : 'Indisponible'}
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  )
}