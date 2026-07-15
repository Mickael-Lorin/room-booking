package fr.ekod.roombooking.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Le prénom est obligatoire")
        @Size(max = 50)
        String firstName,

        @NotBlank(message = "Le nom est obligatoire")
        @Size(max = 50)
        String lastName,

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Format d'email invalide")
        @Size(max = 100)
        String email,

        @NotBlank(message = "Le mot de passe est obligatoire")
        @Size(min = 8, max = 100, message = "Le mot de passe doit contenir au moins 8 caractères")
        String password
) {
}