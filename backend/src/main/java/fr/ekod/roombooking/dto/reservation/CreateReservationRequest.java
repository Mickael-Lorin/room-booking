package fr.ekod.roombooking.dto.reservation;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateReservationRequest(
        @NotNull Long roomId,
        @NotNull LocalDateTime startDateTime,
        @NotNull LocalDateTime endDateTime,
        @NotNull @Min(1) Integer attendeesCount,
        String purpose
) {
}
