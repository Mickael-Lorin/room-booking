package fr.ekod.roombooking.controller;

import fr.ekod.roombooking.dto.auth.AuthResponse;
import fr.ekod.roombooking.dto.auth.LoginRequest;
import fr.ekod.roombooking.dto.auth.RegisterRequest;
import fr.ekod.roombooking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint pour inscrire un nouvel utilisateur.
     * Utilisation de @Valid pour déclencher la validation des champs (si vous mettez des contraintes).
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Endpoint pour connecter un utilisateur existant.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}