import type { Room, RoomSearchParams } from '../types/room'

const API_BASE = '/api/rooms'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }))
    throw new Error(error.message ?? 'Une erreur est survenue')
  }
  return response.json()
}

export async function fetchRooms(): Promise<Room[]> {
  const response = await fetch(API_BASE)
  return handleResponse<Room[]>(response)
}

export async function fetchRoomById(id: number): Promise<Room> {
  const response = await fetch(`${API_BASE}/${id}`)
  return handleResponse<Room>(response)
}

export async function searchRooms(params: RoomSearchParams): Promise<Room[]> {
  const searchParams = new URLSearchParams()

  if (params.minCapacity !== undefined && params.minCapacity > 0) {
    searchParams.set('minCapacity', String(params.minCapacity))
  }
  if (params.equipment?.trim()) {
    searchParams.set('equipment', params.equipment.trim())
  }
  if (params.available !== undefined) {
    searchParams.set('available', String(params.available))
  }
  if (params.location?.trim()) {
    searchParams.set('location', params.location.trim())
  }

  const query = searchParams.toString()
  const url = query ? `${API_BASE}/search?${query}` : API_BASE
  const response = await fetch(url)
  return handleResponse<Room[]>(response)
}
