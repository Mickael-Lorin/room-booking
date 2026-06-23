package fr.ekod.roombooking.dto.room;

public record RoomDTO(
        Long id,
        String name,
        String description,
        Integer capacity,
        String location,
        String equipment,
        Boolean available,
        String imageUrl
) {
}
