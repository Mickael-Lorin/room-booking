import { Link } from 'react-router-dom'
import type { Room } from '../types/room'

interface RoomCardProps {
  room: Room
  onRename: (room: Room) => void
  onEdit: (room: Room) => void
  onDelete: (room: Room) => void
}

export function RoomCard({ room, onRename, onEdit, onDelete }: RoomCardProps) {
  return (
    <article className="room-card">
      <div className="room-card__header">
        <h2 className="room-card__title">{room.name}</h2>
        <span className={`room-badge ${room.available ? 'room-badge--available' : 'room-badge--unavailable'}`}>
          {room.available ? 'Disponible' : 'Indisponible'}
        </span>
      </div>

      {room.description && <p className="room-card__description">{room.description}</p>}

      <ul className="room-card__meta-list">
        <li className="room-card__meta-item">
          <div className="room-card__meta-label">Capacité :</div>
          <div className="room-card__meta-value">{room.capacity} personnes</div>
        </li>
        <li className="room-card__meta-item">
          <div className="room-card__meta-label">Localisation :</div>
          <div className="room-card__meta-value">{room.location}</div>
        </li>
        {room.equipment && (
          <li className="room-card__meta-item">
            <div className="room-card__meta-label">Équipements :</div>
            <div className="room-card__meta-value">{room.equipment}</div>
          </li>
        )}
      </ul>

      <Link to={`/rooms/${room.id}`} className="room-card__link">
        Voir le détail
      </Link>

      <div className="room-card__actions">
        <button type="button" className="btn-secondary btn-sm" onClick={() => onRename(room)}>
          Renommer
        </button>
        <button type="button" className="btn-secondary btn-sm" onClick={() => onEdit(room)}>
          Modifier
        </button>
        <button type="button" className="btn-danger btn-sm" onClick={() => onDelete(room)}>
          Supprimer
        </button>
      </div>
    </article>
  )
}