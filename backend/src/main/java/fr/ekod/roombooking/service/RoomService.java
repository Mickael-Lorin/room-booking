package fr.ekod.roombooking.service;

import fr.ekod.roombooking.dto.room.RoomDTO;
import fr.ekod.roombooking.entity.Room;
import fr.ekod.roombooking.exception.RoomNotFoundException;
import fr.ekod.roombooking.mapper.RoomMapper;
import fr.ekod.roombooking.repository.RoomRepository;
import fr.ekod.roombooking.repository.specification.RoomSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

    public List<RoomDTO> findAll() {
        return roomMapper.toDtoList(roomRepository.findAll());
    }

    public RoomDTO findById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));
        return roomMapper.toDto(room);
    }

    public List<RoomDTO> search(Integer minCapacity, String equipment, Boolean available, String location) {
        Specification<Room> spec = Specification.allOf(
                RoomSpecifications.hasMinCapacity(minCapacity),
                RoomSpecifications.hasEquipment(equipment),
                RoomSpecifications.isAvailable(available),
                RoomSpecifications.hasLocation(location)
        );

        return roomMapper.toDtoList(roomRepository.findAll(spec));
    }
}
