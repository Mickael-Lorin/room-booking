package fr.ekod.roombooking.controller.admin;

import fr.ekod.roombooking.dto.user.UserDTO;
import fr.ekod.roombooking.dto.user.UserUpdateRequest;
import fr.ekod.roombooking.entity.Role;
import fr.ekod.roombooking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<Map<String, String>> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String roleString = body.get("role");
        // Correction : évite le NPE si la clé "role" est absente du corps de la requête.
        if (roleString == null || roleString.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Le champ 'role' est requis"));
        }

        String cleanRole = roleString.replace("ROLE_", "");
        try {
            Role role = Role.valueOf(cleanRole.toUpperCase());
            userService.updateRole(id, role);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Rôle invalide : " + roleString));
        }
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<Void> updateUserStatus(@PathVariable Long id, @RequestParam boolean active) {
        userService.updateStatus(id, active);
        return ResponseEntity.noContent().build();
    }

}