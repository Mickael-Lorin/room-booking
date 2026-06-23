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
      <div className="detail-container">
        {loading && <p className="status-message loading">Chargement des détails...</p>}
        {error && <p className="status-message error">{error}</p>}

        {room && (
          <div className="detail-layout">
            {/* Colonne Gauche : Infos principales */}
            <article className="room-detail-main">
              <div className="room-detail-title">
                <Link to="/rooms" className="back-link">
                  <IoIosBackspace />
                </Link>

                <h2>{room.name}</h2>
              </div>

              {room.description ? (
                <p className="room-description">{room.description}</p>
              ) : (
                <p className="room-description no-desc">Aucune description disponible pour cette salle.</p>
              )}

              <h3 className="section-subtitle">Caractéristiques générales</h3>
              <dl className="room-detail-list">
                <div>
                  <dt>Capacité maximale</dt>
                  <dd>{room.capacity} personnes</dd>
                </div>
                <div>
                  <dt>Localisation</dt>
                  <dd>{room.location}</dd>
                </div>
                <div>
                  <dt>Équipements inclus</dt>
                  <dd>{room.equipment ?? 'Aucun équipement spécifique renseigné'}</dd>
                </div>
              </dl>
            </article>

            {/* Colonne Droite : Sticky Panel d'état / Action */}
            <aside className="room-detail-sidebar">
              <div className="sticky-panel">
                <h3>Statut de la salle</h3>
                <span className={`room-badge ${room.available ? 'available' : 'unavailable'}`}>
                  {room.available ? '● Disponible immédiatement' : '● Occupée / Indisponible'}
                </span>

                <div className="panel-info-rows">
                  <div className="panel-row">
                    <span>Emplacement</span>
                    <span>{room.location}</span>
                  </div>
                  <div className="panel-row">
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