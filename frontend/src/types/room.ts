export interface Room {
  id: number
  name: string
  description: string | null
  capacity: number
  location: string
  equipment: string | null
  available: boolean
  imageUrl: string | null
}

export interface RoomSearchParams {
  minCapacity?: number
  equipment?: string
  available?: boolean
  location?: string
}
