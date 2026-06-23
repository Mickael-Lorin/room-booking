package fr.ekod.roombooking.mapper;

import fr.ekod.roombooking.dto.room.RoomDTO;
import fr.ekod.roombooking.entity.Room;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    RoomDTO toDto(Room room);

    List<RoomDTO> toDtoList(List<Room> rooms);
}
