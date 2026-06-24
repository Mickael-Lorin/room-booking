package fr.ekod.roombooking.mapper;

import fr.ekod.roombooking.dto.reservation.ReservationDTO;
import fr.ekod.roombooking.entity.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "roomName", source = "room.name")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userEmail", source = "user.email")
    ReservationDTO toDto(Reservation reservation);

    List<ReservationDTO> toDtoList(List<Reservation> reservations);
}
