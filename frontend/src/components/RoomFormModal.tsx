import { useEffect, useState, type FormEvent } from 'react'
import type { CreateRoomPayload, Room, UpdateRoomPayload } from '../types/room'

type RoomFormModalProps =
  | {
      mode: 'create'
      room?: undefined
      onSubmit: (payload: CreateRoomPayload) => Promise<void>
      onClose: () => void
    }
  | {
      mode: 'edit'
      room: Room
      onSubmit: (payload: UpdateRoomPayload) => Promise<void>
      onClose: () => void
    }
  | {
      mode: 'rename'
      room: Room
      onSubmit: (name: string) => Promise<void>
      onClose: () => void
    }

export function RoomFormModal(props: RoomFormModalProps) {
  const { mode, onClose, onSubmit } = props
  const room = 'room' in props ? props.room : undefined

  const [name, setName] = useState(room?.name ?? '')
  const [description, setDescription] = useState(room?.description ?? '')
  const [capacity, setCapacity] = useState(room?.capacity ?? 1)
  const [location, setLocation] = useState(room?.location ?? '')
  const [equipment, setEquipment] = useState(room?.equipment ?? '')
  const [available, setAvailable] = useState(room?.available ?? true)
  const [imageUrl, setImageUrl] = useState(room?.imageUrl ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const title =
    mode === 'create' ? 'Ajouter une salle' : mode === 'edit' ? 'Modifier la salle' : 'Renommer la salle'

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (mode === 'rename') {
        await onSubmit(name.trim())
      } else if (mode === 'create') {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || null,
          capacity,
          location: location.trim(),
          equipment: equipment.trim() || null,
          available,
          imageUrl: imageUrl.trim() || null,
        })
      } else {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || null,
          capacity,
          location: location.trim(),
          equipment: equipment.trim() || null,
          available,
          imageUrl: imageUrl.trim() || null,
        })
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="room-form-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 id="room-form-title" className="modal__title">{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <form className="modal__form" onSubmit={(event) => void handleSubmit(event)}>
          <div className="room-filters__field">
            <label className="room-filters__label" htmlFor="room-name">Nom</label>
            <input
              id="room-name"
              className="room-filters__input"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          {mode !== 'rename' && (
            <>
              <div className="room-filters__field">
                <label className="room-filters__label" htmlFor="room-description">Description</label>
                <textarea
                  id="room-description"
                  className="room-filters__input room-filters__textarea"
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="room-filters__field">
                <label className="room-filters__label" htmlFor="room-capacity">Capacité</label>
                <input
                  id="room-capacity"
                  className="room-filters__input"
                  type="number"
                  min={1}
                  required
                  value={capacity}
                  onChange={(event) => setCapacity(Number(event.target.value))}
                />
              </div>

              <div className="room-filters__field">
                <label className="room-filters__label" htmlFor="room-location">Localisation</label>
                <input
                  id="room-location"
                  className="room-filters__input"
                  type="text"
                  required
                  maxLength={100}
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </div>

              <div className="room-filters__field">
                <label className="room-filters__label" htmlFor="room-equipment">Équipements</label>
                <input
                  id="room-equipment"
                  className="room-filters__input"
                  type="text"
                  value={equipment}
                  onChange={(event) => setEquipment(event.target.value)}
                />
              </div>

              <div className="room-filters__field">
                <label className="room-filters__label" htmlFor="room-available">Disponibilité</label>
                <select
                  id="room-available"
                  className="room-filters__select"
                  value={String(available)}
                  onChange={(event) => setAvailable(event.target.value === 'true')}
                >
                  <option value="true">Disponible</option>
                  <option value="false">Indisponible</option>
                </select>
              </div>

              <div className="room-filters__field">
                <label className="room-filters__label" htmlFor="room-image">URL de l'image</label>
                <input
                  id="room-image"
                  className="room-filters__input"
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
              </div>
            </>
          )}

          {error && <p className="status-message status-message--error">{error}</p>}

          <div className="modal__actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
