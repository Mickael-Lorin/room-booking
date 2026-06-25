import { Layout } from '../components/Layout'
import { RoomCard } from '../components/RoomCard'
import { RoomFilters } from '../components/RoomFilters'
import { RoomFormModal } from '../components/RoomFormModal'
import { fetchRooms, searchRooms } from '../api/rooms'
import { adminRoomService } from '../services/AdminRoomService'
import type { Room, RoomSearchParams } from '../types/room'
import { useCallback, useEffect, useState } from 'react'
import '../styles/RoomListPage.css'

const emptyFilters: RoomSearchParams = {}

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; room: Room }
  | { type: 'rename'; room: Room }
  | null

export function RoomListPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [filters, setFilters] = useState<RoomSearchParams>(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)

  const loadRooms = useCallback(async (searchFilters: RoomSearchParams = emptyFilters) => {
    setLoading(true)
    setError(null)

    try {
      const hasFilters =
        searchFilters.minCapacity !== undefined ||
        Boolean(searchFilters.equipment?.trim()) ||
        searchFilters.available !== undefined ||
        Boolean(searchFilters.location?.trim())

      const data = hasFilters ? await searchRooms(searchFilters) : await fetchRooms()
      setRooms(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les salles')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRooms()
  }, [loadRooms])

  return (
    <Layout>
      <div className="hero-banner">
        <div className="hero-banner__overlay">
          <h1 className="hero-banner__title">Trouvez la salle idéale pour vos réunions</h1>
          <p className="hero-banner__description">Consultez l'offre de salles en temps réel et filtrez selon vos besoins et équipements.</p>
        </div>
      </div>

      <div className="room-list-page">
        <aside className="room-list-page__sidebar">
          <div className="room-list-page__sticky-wrapper">
            <h3 className="room-list-page__sidebar-title">Filtres de recherche</h3>
            <RoomFilters
              filters={filters}
              onChange={setFilters}
              onSearch={() => void loadRooms(filters)}
              onReset={() => {
                setFilters(emptyFilters)
                void loadRooms(emptyFilters)
              }}
            />
          </div>
        </aside>

        <section className="room-list-page__content">
          <div className="room-list-page__toolbar">
            <button type="button" className="btn-primary" onClick={() => setModal({ type: 'create' })}>
              Ajouter une salle
            </button>
          </div>

          {loading && (
            <div className="status-container">
              <p className="status-message status-message--loading">Chargement des salles disponibles...</p>
            </div>
          )}

          {error && (
            <div className="status-container">
              <p className="status-message status-message--error">{error}</p>
            </div>
          )}

          {!loading && !error && rooms.length === 0 && (
            <div className="status-container">
              <p className="status-message status-message--empty">Aucune salle ne correspond à vos critères de recherche.</p>
            </div>
          )}

          {!loading && !error && rooms.length > 0 && (
            <div className="room-grid">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {modal?.type === 'create' && (
        <RoomFormModal
          mode="create"
          onClose={() => setModal(null)}
          onSubmit={async (payload) => {
            const created = await adminRoomService.createRoom(payload)
            setRooms((current) => [...current, created])
          }}
        />
      )}
    </Layout>
  )
}