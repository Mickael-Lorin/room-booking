package fr.ekod.roombooking.config;

import fr.ekod.roombooking.entity.Role;
import fr.ekod.roombooking.entity.User;
import fr.ekod.roombooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class UserInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initUser() {
        return args -> {
            if (userRepository.findByEmail("user@ekod.fr").isEmpty()) {
                User admin = User.builder()
                        .firstName("User")
                        .lastName("System")
                        .email("user@ekod.fr")
                        .password(passwordEncoder.encode("user!"))
                        .role(Role.USER)
                        .active(true)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin par défaut créé : admin@ekod.fr / admin!");
            }
        };
    }
}