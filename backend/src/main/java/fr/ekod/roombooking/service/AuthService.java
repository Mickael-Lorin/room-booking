package fr.ekod.roombooking.service;

import fr.ekod.roombooking.dto.auth.AuthResponse;
import fr.ekod.roombooking.dto.auth.LoginRequest;
import fr.ekod.roombooking.dto.auth.RegisterRequest;
import fr.ekod.roombooking.entity.Role;
import fr.ekod.roombooking.entity.User;
import fr.ekod.roombooking.exception.EmailAlreadyExistsException;
import fr.ekod.roombooking.repository.UserRepository;
import fr.ekod.roombooking.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Correction : vérifie qu'aucun compte n'existe déjà avec cet email,
        // sinon la contrainte unique en base levait une exception SQL non gérée (500).
        if (Boolean.TRUE.equals(userRepository.existsByEmail(request.email()))) {
            throw new EmailAlreadyExistsException(request.email());
        }

        var user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return new AuthResponse(
                jwtService.generateAccessToken(user),
                jwtService.generateRefreshToken(user)
        );
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        return new AuthResponse(
                jwtService.generateAccessToken(user),
                jwtService.generateRefreshToken(user)
        );
    }

}