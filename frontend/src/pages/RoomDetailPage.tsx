import { Layout } from '../components/Layout'
import { RoomFormModal } from '../components/RoomFormModal'
import { deleteRoom, fetchRoomById, patchRoomName, updateRoom } from '../api/rooms'
import type { Room } from '../types/room'
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { IoPencil, IoTrash  } from "react-icons/io5";
import '../styles/RoomDetailPage.css'

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
      navigate('/rooms')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de supprimer la salle')
    }
  }

  return (
    <Layout>
      {room && (
          <div className="room-detail__breadcrumb">
            <Link to="/rooms" className="room-detail__back-link">Accueil</Link>⬅<p className="room-detail__room-link-disabled">{room.name}</p>
          </div>
      )}

      <div className="room-detail-container">
        {loading && <p className="status-message status-message--loading">Chargement des détails...</p>}
        {error && <p className="status-message status-message--error">{error}</p>}

        {room && (
          <div className="room-detail room-detail--new-layout">

            {/* Colonne Gauche : Image de la salle */}
            <div className="room-detail__image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop"
                alt={`Vue de la salle ${room.name}`}
                className="room-detail__image"
              />
            </div>

            {/* Colonne Droite : Contenu Texte Simplifié */}
            <div className="room-detail__content">

              {/* En-tête simplifié */}
              <div className="room-detail__header-simple">
                <h2 className="room-detail__title">{room.name}</h2>
                <button type="button" className="btn-rename btn-sm" onClick={() => setModal({ type: 'rename', room })} title="Renommer la salle">
                  <IoPencil />
                </button>
              </div>

              {room.description ? (
                <p className="room-detail__description">{room.description}</p>
              ) : (
                <p className="room-detail__description room-detail__description--empty">Aucune description disponible.</p>
              )}

              {/* Bloc de Caractéristiques simplifié */}
              <div className="room-detail__status-block">
                <span className={`room-badge ${room.available ? 'room-badge--available' : 'room-badge--unavailable'}`}>
                  {room.available ? 'Disponible' : 'Occupée'}
                </span>
                <span className="room-detail__quick-spec">{room.location}</span>
                <span className="room-detail__quick-spec">{room.capacity} places</span>
              </div>

              <h3 className="room-detail__section-subtitle">Détails de l'équipement</h3>
              <p className="room-detail__equipment">{room.equipment ?? 'Aucun équipement renseigné'}</p>

              {/* Bloc d'actions principal simplifié */}
              <div className="room-detail__actions-simple">
                {room.available ? (
                  <Link to={`/rooms/${room.id}/book`} className="btn-primary">
                    Réserver maintenant
                  </Link>
                ) : (
                  <button className="btn-primary" disabled>Indisponible</button>
                )}

                <div className="room-detail__admin-actions">
                    <button type="button" className="btn-secondary btn-admin" onClick={() => setModal({ type: 'edit', room })}>
                        Modifier la salle
                    </button>
                    <button type="button" className="btn-danger btn-admin" onClick={() => void handleDelete(room)}>
                        <IoTrash />
                    </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Gestion des Modales (inchangée) */}
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