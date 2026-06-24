export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Reservation {
  id: number
  startDateTime: string
  endDateTime: string
  status: ReservationStatus
  purpose: string | null
  attendeesCount: number
  roomId: number
  roomName: string
  userId: number
  userEmail: string
  createdAt: string
}

export interface CreateReservationPayload {
  roomId: number
  startDateTime: string
  endDateTime: string
  attendeesCount: number
  purpose?: string
}
