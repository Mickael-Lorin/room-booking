package fr.ekod.roombooking.dto.user;


import java.time.LocalDateTime;

public record UserDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String role,
        Boolean active,
        LocalDateTime createdAt
) {}
