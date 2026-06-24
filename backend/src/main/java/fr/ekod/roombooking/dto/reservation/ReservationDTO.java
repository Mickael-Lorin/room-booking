package fr.ekod.roombooking.dto.reservation;

import fr.ekod.roombooking.entity.Reservation;

import java.time.LocalDateTime;

public record ReservationDTO(
        Long id,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Reservation.Status status,
        String purpose,
        Integer attendeesCount,
        Long roomId,
        String roomName,
        Long userId,
        String userEmail,
        LocalDateTime createdAt
) {
}
