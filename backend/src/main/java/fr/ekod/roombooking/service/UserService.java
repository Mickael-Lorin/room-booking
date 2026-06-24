package fr.ekod.roombooking.service;

import fr.ekod.roombooking.dto.user.UserDTO;
import fr.ekod.roombooking.mapper.UserMapper;
import fr.ekod.roombooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
