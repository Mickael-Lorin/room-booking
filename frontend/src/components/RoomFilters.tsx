import type { RoomSearchParams } from '../types/room'

interface RoomFiltersProps {
  filters: RoomSearchParams
  onChange: (filters: RoomSearchParams) => void
  onSearch: () => void
  onReset: () => void
}

export function RoomFilters({ filters, onChange, onSearch, onReset }: RoomFiltersProps) {
  return (
    <form
      className="room-filters"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch()
      }}
    >
      <div className="room-filters__field">
        <label className="room-filters__label" htmlFor="minCapacity">Capacité minimale</label>
        <input
          id="minCapacity"
          className="room-filters__input"
          type="number"
          min={1}
          placeholder="Ex : 10"
          value={filters.minCapacity ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              minCapacity: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="room-filters__field">
        <label className="room-filters__label" htmlFor="equipment">Équipement</label>
        <input
          id="equipment"
          className="room-filters__input"
          type="text"
          placeholder="Ex : Projecteur"
          value={filters.equipment ?? ''}
          onChange={(event) => onChange({ ...filters, equipment: event.target.value })}
        />
      </div>

      <div className="room-filters__field">
        <label className="room-filters__label" htmlFor="location">Localisation</label>
        <input
          id="location"
          className="room-filters__input"
          type="text"
          placeholder="Ex : Bâtiment A"
          value={filters.location ?? ''}
          onChange={(event) => onChange({ ...filters, location: event.target.value })}
        />
      </div>

      <div className="room-filters__field">
        <label className="room-filters__label" htmlFor="available">Disponibilité</label>
        <select
          id="available"
          className="room-filters__select"
          value={filters.available === undefined ? '' : String(filters.available)}
          onChange={(event) => {
            const value = event.target.value
            onChange({
              ...filters,
              available: value === '' ? undefined : value === 'true',
            })
          }}
        >
          <option value="">Toutes</option>
          <option value="true">Disponibles</option>
          <option value="false">Indisponibles</option>
        </select>
      </div>

      <div className="room-filters__actions">
        <button type="submit" className="btn-primary">
          Rechercher
        </button>
        <button type="button" className="btn-secondary" onClick={onReset}>
          Réinitialiser
        </button>
      </div>
    </form>
  )
}