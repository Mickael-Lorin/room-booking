package fr.ekod.roombooking.mapper;

import fr.ekod.roombooking.dto.user.UserDTO;
import fr.ekod.roombooking.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDto(User user);
}
