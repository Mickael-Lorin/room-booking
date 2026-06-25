import { apiRequest } from './http'
import type { Reservation } from '../types/reservation'

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface UpdateReservationStatusPayload {
    status: ReservationStatus
}

const ADMIN_RESERVATIONS_ENDPOINT = '/admin/reservations'

export const adminReservationsApi = {
    getReservations(): Promise<Reservation[]> {
        return apiRequest<Reservation[]>(ADMIN_RESERVATIONS_ENDPOINT, {
            authenticated: true,
        })
    },

    updateStatus(
        id: number,
        payload: UpdateReservationStatusPayload
    ): Promise<Reservation> {
        return apiRequest<Reservation>(`${ADMIN_RESERVATIONS_ENDPOINT}/${id}/status`, {
            method: 'PATCH',
            authenticated: true,
            body: payload,
        })
    },

    cancelReservation(id: number): Promise<Reservation> {
        return apiRequest<Reservation>(`${ADMIN_RESERVATIONS_ENDPOINT}/${id}/cancel`, {
            method: 'PATCH',
            authenticated: true,
        })
    },
}