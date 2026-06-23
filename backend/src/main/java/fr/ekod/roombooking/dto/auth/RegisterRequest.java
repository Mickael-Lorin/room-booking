package fr.ekod.roombooking.dto.auth;

import fr.ekod.roombooking.entity.Role;

public record RegisterRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        Role role
) {
}
