import {
    adminReservationsApi,
    type ReservationStatus,
} from '../api/adminReservationsApi'
import type { Reservation } from '../types/reservation'

export const adminReservationService = {
    getReservations(): Promise<Reservation[]> {
        return adminReservationsApi.getReservations()
    },

    validateReservation(id: number): Promise<Reservation> {
        return adminReservationsApi.updateStatus(id, {
            status: 'CONFIRMED',
        })
    },

    cancelReservation(id: number): Promise<Reservation> {
        return adminReservationsApi.cancelReservation(id)
    },

    updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
        return adminReservationsApi.updateStatus(id, {
            status,
        })
    },
}