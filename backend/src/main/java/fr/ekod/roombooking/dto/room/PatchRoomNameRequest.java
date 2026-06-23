package fr.ekod.roombooking.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PatchRoomNameRequest(
        @NotBlank @Size(max = 100) String name
) {
}
