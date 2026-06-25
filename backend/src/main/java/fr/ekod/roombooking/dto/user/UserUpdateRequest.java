package fr.ekod.roombooking.dto.user;

public record UserUpdateRequest(
        String firstName,
        String lastName,
        String email
) { }
