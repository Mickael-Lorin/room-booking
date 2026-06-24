package fr.ekod.roombooking.dto.reservation;

import fr.ekod.roombooking.entity.Reservation;
import jakarta.validation.constraints.NotNull;

public record UpdateReservationStatusRequest(
        @NotNull Reservation.Status status
) {
}
