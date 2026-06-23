import { Layout } from '../components/Layout'
import { RoomCard } from '../components/RoomCard'
import { RoomFilters } from '../components/RoomFilters'
import { fetchRooms, searchRooms } from '../api/rooms'
import type { Room, RoomSearchParams } from '../types/room'
import { useCallback, useEffect, useState } from 'react'

const emptyFilters: RoomSearchParams = {}

export function RoomListPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [filters, setFilters] = useState<RoomSearchParams>(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}