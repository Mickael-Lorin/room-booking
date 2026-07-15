package fr.ekod.roombooking.config;

import fr.ekod.roombooking.entity.Role;
import fr.ekod.roombooking.entity.User;
import fr.ekod.roombooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class UserInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initUser() {
        return args -> {
            if (userRepository.findByEmail("user@ekod.fr").isEmpty()) {
                User user = User.builder()
                        .firstName("User")
                        .lastName("System")
                        .email("user@ekod.fr")
                        .password(passwordEncoder.encode("user!"))
                        .role(Role.USER)
                        .active(true)
                        .build();
                userRepository.save(user);
                // Correction : le message annonçait un compte admin alors qu'il
                // s'agit bien du compte utilisateur standard.
                log.info("Utilisateur par défaut créé : user@ekod.fr / user!");
            }
        };
    }
}