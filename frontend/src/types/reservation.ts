export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Reservation {
  id: number;
  startDate?: string;
  endDate?: string;
  startDateTime: string;
  endDateTime: string;
  status: string;
  room: {
    id: number;
    name: string;
    [key: string]: any;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    [key: string]: any;
  };
}

export interface CreateReservationPayload {
  roomId: number
  startDateTime: string
  endDateTime: string
  attendeesCount: number
  purpose?: string
}
