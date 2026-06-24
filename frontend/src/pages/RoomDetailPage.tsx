import { Layout } from '../components/Layout'
import { RoomFormModal } from '../components/RoomFormModal'
import { deleteRoom, fetchRoomById, patchRoomName, updateRoom } from '../api/rooms'
import type { Room } from '../types/room'
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { IoIosBackspace } from "react-icons/io";

type ModalState =
  | { type: 'edit'; room: Room }
  | { type: 'rename'; room: Room }
  | null

export function RoomDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)

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

  const handleDelete = async (currentRoom: Room) => {
    const confirmed = window.confirm(`Supprimer la salle « ${currentRoom.name} » ?`)
    if (!confirmed) {
      return
    }

    try {
      await deleteRoom(currentRoom.id)
      // Redirection vers la liste des salles après suppression
      navigate('/rooms')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de supprimer la salle')
    }
  }

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

              {/* Bloc d'actions pour Modifier / Supprimer */}
              <div className="room-card__actions" style={{ marginTop: '2rem', paddingTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setModal({ type: 'rename', room })}>
                  Modifier le nom
                </button>
                <button type="button" className="btn-secondary" onClick={() => setModal({ type: 'edit', room })}>
                  Modifier toutes les informations
                </button>
                <button type="button" className="btn-danger" onClick={() => void handleDelete(room)}>
                  Supprimer
                </button>
              </div>
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

                {room.available ? (
                  <Link to={`/rooms/${room.id}/book`} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', textAlign: 'center', display: 'block' }}>
                    Réserver cette salle
                  </Link>
                ) : (
                  <button
                    className="btn-primary"
                    disabled
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    Indisponible
                  </button>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Gestion des Modales de modification */}
      {modal?.type === 'edit' && (
        <RoomFormModal
          mode="edit"
          room={modal.room}
          onClose={() => setModal(null)}
          onSubmit={async (payload) => {
            const updated = await updateRoom(modal.room.id, payload)
            setRoom(updated)
          }}
        />
      )}

      {modal?.type === 'rename' && (
        <RoomFormModal
          mode="rename"
          room={modal.room}
          onClose={() => setModal(null)}
          onSubmit={async (name) => {
            const updated = await patchRoomName(modal.room.id, { name })
            setRoom(updated)
          }}
        />
      )}
    </Layout>
  )
}