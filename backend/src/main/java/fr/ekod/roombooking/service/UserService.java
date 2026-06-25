package fr.ekod.roombooking.service;

import fr.ekod.roombooking.dto.user.UserDTO;
import fr.ekod.roombooking.dto.user.UserUpdateRequest;
import fr.ekod.roombooking.entity.Role;
import fr.ekod.roombooking.entity.User;
import fr.ekod.roombooking.exception.UserNotFoundException;
import fr.ekod.roombooking.mapper.UserMapper;
import fr.ekod.roombooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<UserDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserDTO findById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'identifiant : " + id));
    }
    @Transactional
    public UserDTO updateUser(Long id, UserUpdateRequest request) {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));
            user.setFirstName(request.firstName());
            user.setLastName(request.lastName());
            user.setEmail(request.email());

    return userMapper.toDto(userRepository.save(user));
    }
    @Transactional
    public void updateRole(long id, Role newRole){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));
        user.setRole(newRole);
        userRepository.save(user);
    }

    @Transactional
    public void updateStatus(long id, boolean active){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur introuvable"));
        user.setActive(active);
        userRepository.save(user);
    }
}
