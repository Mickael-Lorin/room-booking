import { apiRequest } from './http'
import type { Room, RoomSearchParams } from '../types/room'

const ROOMS_ENDPOINT = '/rooms'

function buildRoomSearchParams(params: RoomSearchParams): URLSearchParams {
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

  return searchParams
}

export function fetchRooms(): Promise<Room[]> {
  return apiRequest<Room[]>(ROOMS_ENDPOINT)
}

export function fetchRoomById(id: number): Promise<Room> {
  return apiRequest<Room>(`${ROOMS_ENDPOINT}/${id}`)
}

export function searchRooms(params: RoomSearchParams): Promise<Room[]> {
  const query = buildRoomSearchParams(params).toString()
  const endpoint = query ? `${ROOMS_ENDPOINT}/search?${query}` : ROOMS_ENDPOINT

  return apiRequest<Room[]>(endpoint)
}