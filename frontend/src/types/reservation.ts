export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | string;

export interface Reservation {
  id: number;
  startDate?: string;
  endDate?: string;
  startDateTime: string;
  endDateTime: string;
  status: ReservationStatus; // Utilise le type pour l'indexation

  // 🟢 Propriétés requises par BookRoomPage et MyReservationsPage
  purpose?: string;
  roomName?: string;
  roomId?: number;
  attendeesCount?: number;

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

  // 🟢 Index signature pour accepter d'autres champs dynamiques sans bloquer
  [key: string]: any;
}

export interface CreateReservationPayload {
  roomId: number
  startDateTime: string
  endDateTime: string
  attendeesCount: number
  purpose?: string
}
