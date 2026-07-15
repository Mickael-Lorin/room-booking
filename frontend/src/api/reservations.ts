import { authHeaders, handleResponse, API_BASE_URL } from './http'
import type { CreateReservationPayload, Reservation } from '../types/reservation'

const API_BASE = `${API_BASE_URL}/reservations`

export async function fetchMyReservations(): Promise<Reservation[]> {
  const response = await fetch(`${API_BASE}/me`, {
    headers: authHeaders(false),
  })
  return handleResponse<Reservation[]>(response)
}

export async function createReservation(payload: CreateReservationPayload): Promise<Reservation> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse<Reservation>(response)
}

export async function cancelReservation(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(false),
  })
  await handleResponse<void>(response)
}

export async function fetchRoomReservations(roomId: number): Promise<Reservation[]> {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/reservations`)
  return handleResponse<Reservation[]>(response)
}
