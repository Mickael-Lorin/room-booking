package fr.ekod.roombooking.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken
) {
}
