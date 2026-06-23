package fr.ekod.roombooking.dto.room;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRoomRequest(
        @NotBlank @Size(max = 100) String name,
        String description,
        @NotNull @Min(1) Integer capacity,
        @NotBlank @Size(max = 100) String location,
        String equipment,
        Boolean available,
        String imageUrl
) {
}
