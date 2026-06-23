import { Link } from 'react-router-dom'
import type { Room } from '../types/room'

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="room-card">
      <div className="room-card-header">
        <h2>{room.name}</h2>
        <span className={`room-badge ${room.available ? 'available' : 'unavailable'}`}>
          {room.available ? 'Disponible' : 'Indisponible'}
        </span>
      </div>

      {room.description && <p className="room-description">{room.description}</p>}

      <ul className="room-meta">
        <li>
          <div className="room-informations-title">Capacité :</div> <div className="room-informations">{room.capacity} personnes</div>
        </li>
        <li>
          <div className="room-informations-title">Localisation :</div> <div className="room-informations">{room.location}</div>
        </li>
        {room.equipment && (
          <li>
            <div className="room-informations-title">Équipements :</div> <div className="room-informations">{room.equipment}</div>
          </li>
        )}
      </ul>

      <Link to={`/rooms/${room.id}`} className="room-link">
        Voir le détail
      </Link>
    </article>
  )
}
